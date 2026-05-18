import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders, updateOrderStatus } from "../../services/orders";
import PopupConfirm from "../../components/Modals/PopupConfirm/PopupConfirm";
import PopupSuccess from "../../components/Modals/PopupSuccess/PopupSuccess";
import useConfirmPopup from "../../hooks/useConfirmPopup";
import useSuccessPopup from "../../hooks/useSuccessPopup";
import "./Orders.css";

const STATUS_LABELS = {
  PENDING:     "Pendiente",
  IN_PROGRESS: "En progreso",
  COMPLETED:   "Completado",
  CANCELLED:   "Cancelado",
};

export default function Orders() {
  const { user } = useAuth();
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirmPopup();
  const { successState, showSuccess, hideSuccess } = useSuccessPopup();

  const [orders, setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]    = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const [activeTab, setActiveTab] = useState("client");

  useEffect(() => {
    setLoading(true);
    getMyOrders()
      .then(setOrders)
      .catch(() => setError("No se pudieron cargar los encargos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="orders-page"><p>Cargando encargos…</p></div>;
  if (error)   return <div className="orders-page"><p className="orders-error">{error}</p></div>;

  const asClient  = orders.filter((o) => o.buyerId  === user?.id);
  const asCreator = orders.filter((o) => o.creatorId === user?.id);

  const handleCancelOrder = (orderId) => {
    showConfirm(
      "¿Estás seguro de que deseas cancelar este encargo?",
      "Cancelar encargo",
      async () => {
        setCancellingOrderId(orderId);
        try {
          const updated = await updateOrderStatus(Number(orderId), "CANCELLED");
          setOrders((prevOrders) =>
            prevOrders.map((o) => (o.id === orderId ? { ...o, ...updated, status: "CANCELLED" } : o))
          );
          showSuccess("Encargo cancelado correctamente.", "Encargo actualizado");
        } catch {
          showSuccess("Error al cancelar el encargo. Inténtalo de nuevo más tarde.", "Error");
        } finally {
          setCancellingOrderId(null);
        }
      }
    );
  };

  const renderOrders = (orders, role) => (
    orders.length === 0 ? (
      <p className="orders-empty">
        {role === "buyer" ? "No has realizado ningún encargo todavía." : "Aún no tienes encargos recibidos."}
      </p>
    ) : (
      <ul className="orders-list">
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            role={role}
            onCancel={handleCancelOrder}
            isCancelling={cancellingOrderId === o.id}
          />
        ))}
      </ul>
    )
  );

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">Mis encargos</h1>

      <div className="orders-tabs">
        <button
          className={`orders-tab ${activeTab === "client" ? "active" : ""}`}
          onClick={() => setActiveTab("client")}
        >
          Como cliente
        </button>
        <button
          className={`orders-tab ${activeTab === "creator" ? "active" : ""}`}
          onClick={() => setActiveTab("creator")}
        >
          Como creador
        </button>
      </div>

      <div className="orders-blobs">
        <div className="decor-blob deco-1" aria-hidden="true" />
        <div className="decor-blob deco-2" aria-hidden="true" />
        <div className="decor-blob deco-3" aria-hidden="true" />
        <div className="decor-blob deco-4" aria-hidden="true" />
        <div className="decor-blob deco-5" aria-hidden="true" />
        <div className="decor-blob deco-6" aria-hidden="true" />
        <div className="decor-blob deco-7" aria-hidden="true" />
        <div className="decor-blob deco-8" aria-hidden="true" />
      </div>

      {activeTab === "client" && renderOrders(asClient, "buyer")}
      {activeTab === "creator" && renderOrders(asCreator, "creator")}

      <PopupConfirm
        isOpen={confirmState.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={confirmState.message}
        title={confirmState.title}
        confirmText="Sí, cancelar"
        cancelText="Volver"
      />

      <PopupSuccess
        isOpen={successState.isOpen}
        onClose={hideSuccess}
        message={successState.message}
        title={successState.title}
      />
    </div>
  );
}

function OrderCard({ order, role, onCancel, isCancelling }) {
  return (
    <li className="order-card">
      <div className="order-card__info">
        <span className={`order-card__status order-card__status--${order.status?.toLowerCase()}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
        <h3 className="order-card__title">{order.itemTitle ?? `Encargo #${order.id}`}</h3>
        <p className="order-card__meta">
          {role === "buyer"
            ? `Creador: ${order.creatorUsername ?? "—"}`
            : `Cliente: ${order.buyerUsername ?? "—"}`}
        </p>
        <p className="order-card__price">{order.finalPrice?.toFixed(2)} €</p>
      </div>
      <div className="order-card__actions">
        <Link className="order-card__link" to={`/orders/${order.id}`}>
          Ver tablón →
        </Link>
        <Link className="order-card__dispute-btn" to={`/orders/${order.id}/dispute`}>
          Ver disputa
        </Link>
        {order.status !== "CANCELLED" && (
          <button
            className="order-card__cancel-btn"
            onClick={() => onCancel(order.id)}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelando..." : "Cancelar encargo"}
          </button>
        )}
      </div>
    </li>
  );
}
