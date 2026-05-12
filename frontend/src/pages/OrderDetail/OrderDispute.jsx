import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrderById } from "../../services/orders";
import { getDisputeByOrderId } from "../../services/disputes";
import CreateDisputeModal from "../../components/CreateDisputeModal";
import DisputePanel from "../../components/DisputePanel";
import "./OrderDispute.css";

function isNotFoundError(message) {
  const value = String(message || "").toLowerCase();
  return value.includes("not found") || value.includes("no encontrada") || value.includes("no encontrado");
}

export default function OrderDispute() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = useMemo(() => {
    if (!user?.roles || !Array.isArray(user.roles)) return false;
    return user.roles.some((r) => r?.name === "ADMIN");
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setDispute(null);
      try {
        const loadedOrder = await getOrderById(Number(orderId));
        if (cancelled) return;
        setOrder(loadedOrder);

        try {
          const loadedDispute = await getDisputeByOrderId(Number(orderId));
          if (cancelled) return;
          setDispute(loadedDispute);
        } catch (err) {
          if (cancelled) return;
          if (!isNotFoundError(err.message)) {
            setError(err.message || "No se pudo cargar la disputa");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "No se pudo cargar el encargo");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleDisputeCreated = (created) => {
    setDispute(created);
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="od-dispute-page">
        <p>Cargando disputa...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="od-dispute-page">
        <p className="od-dispute-error">{error}</p>
        <button className="od-dispute-back" onClick={() => navigate("/orders")}>Volver</button>
      </div>
    );
  }

  return (
    <div className="od-dispute-page">
      <button className="od-dispute-back" onClick={() => navigate(`/orders/${orderId}`)}>
        ← Volver al encargo
      </button>

      <header className="od-dispute-header">
        <div>
          <h1 className="od-dispute-title">Disputa del encargo #{orderId}</h1>
          {order && <p className="od-dispute-sub">{order.itemTitle ?? "Encargo"}</p>}
        </div>
        <div className="od-dispute-actions">
          {dispute ? (
            <span className={`od-dispute-badge od-dispute-badge--${String(dispute.status || "").toLowerCase()}`}>
              {dispute.status === "OPEN" ? "Abierta" : "Cerrada"}
            </span>
          ) : (
            <button className="od-dispute-open-btn" onClick={() => setShowCreateModal(true)}>
              Abrir disputa
            </button>
          )}
        </div>
      </header>

      {error && <p className="od-dispute-error">{error}</p>}

      {dispute ? (
        <DisputePanel disputeId={dispute.id} isAdmin={isAdmin} />
      ) : (
        <div className="od-dispute-empty">
          <p>No hay disputas registradas para este encargo.</p>
        </div>
      )}

      {showCreateModal && (
        <CreateDisputeModal
          orderId={Number(orderId)}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleDisputeCreated}
        />
      )}
    </div>
  );
}
