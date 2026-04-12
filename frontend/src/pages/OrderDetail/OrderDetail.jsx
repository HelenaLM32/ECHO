import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrderById, updateOrderStatus } from "../../services/orders";
import OrderBoard from "../../components/OrderBoard/OrderBoard";
import "./OrderDetail.css";

const STATUS_LABELS = {
  PENDING:     "Pendiente",
  IN_PROGRESS: "En progreso",
  COMPLETED:   "Completado",
  CANCELLED:   "Cancelado",
};

const NEXT_STATUSES = {
  PENDING:     ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED",   "CANCELLED"],
  COMPLETED:   [],
  CANCELLED:   [],
};

export default function OrderDetail() {
  const { orderId } = useParams();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrderById(Number(orderId))
      .then(setOrder)
      .catch((e) => setError(e.message || "No se pudo cargar el encargo"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setError("");
    try {
      const updated = await updateOrderStatus(Number(orderId), newStatus);
      setOrder(updated);
    } catch (e) {
      setError(e.message || "Error al actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="od-page"><p>Cargando encargo…</p></div>;
  if (error && !order) return (
    <div className="od-page">
      <p className="od-error">{error}</p>
      <button className="od-back-btn" onClick={() => navigate("/orders")}>← Volver</button>
    </div>
  );

  const isCreator = user?.id === order?.creatorId;
  const isBuyer   = user?.id === order?.buyerId;

  return (
    <div className="od-page">
      <button className="od-back-btn" onClick={() => navigate("/orders")}>
        ← Volver a mis encargos
      </button>

      <header className="od-header">
        <div>
          <h1 className="od-header__title">
            {order.itemTitle ?? `Encargo #${order.id}`}
          </h1>
          <p className="od-header__sub">
            {isBuyer
              ? `Creador: ${order.creatorUsername ?? "—"}`
              : `Cliente: ${order.buyerUsername ?? "—"}`}
          </p>
          <p className="od-header__price">{order.finalPrice?.toFixed(2)} €</p>
        </div>

        <div className="od-header__right">
          <span
            className={`od-status od-status--${order.status?.toLowerCase()}`}
          >
            {STATUS_LABELS[order.status] ?? order.status}
          </span>

          {isCreator && NEXT_STATUSES[order.status]?.length > 0 && (
            <div className="od-status-actions">
              {NEXT_STATUSES[order.status].map((s) => (
                <button
                  key={s}
                  className={`od-status-btn od-status-btn--${s.toLowerCase()}`}
                  disabled={updating}
                  onClick={() => handleStatusChange(s)}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {error && <p className="od-error">{error}</p>}

      <OrderBoard
        orderId={order.id}
        buyerId={order.buyerId}
        creatorId={order.creatorId}
      />
    </div>
  );
}
