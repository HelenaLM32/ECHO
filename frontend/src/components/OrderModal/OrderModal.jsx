import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../services/orders";
import "./OrderModal.css";

/**
 * Modal de confirmación de encargo.
 *
 * Props:
 *   itemId     {number}   – id del item en el backend
 *   itemTitle  {string}   – nombre del servicio o proyecto
 *   basePrice  {number}   – precio base del item
 *   onClose    {function} – cierra el modal sin confirmar
 */
export default function OrderModal({ itemId, itemTitle, basePrice, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [done, setDone]       = useState(false);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await createOrder(itemId, basePrice ?? null);
      setDone(true);
    } catch (err) {
      setError(err.message || "No se pudo crear el encargo. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoToOrders() {
    onClose();
    navigate("/orders");
  }

  return (
    <div className="om-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Confirmar encargo">
      <div className="om-box" onClick={(e) => e.stopPropagation()}>
        <button className="om-close" onClick={onClose} aria-label="Cerrar">✕</button>

        {!done ? (
          <>
            <p className="om-tag">Confirmar encargo</p>
            <h2 className="om-title">{itemTitle}</h2>

            {basePrice != null && (
              <p className="om-price">
                Precio base: <strong>{Number(basePrice).toFixed(2)} €</strong>
              </p>
            )}

            <p className="om-hint">
              Al confirmar se creará un encargo en estado <strong>pendiente</strong>.
              El creador recibirá tu solicitud y podrá aceptarla o gestionarla desde su panel.
            </p>

            {error && <p className="om-error" role="alert">{error}</p>}

            <div className="om-actions">
              <button className="om-btn om-btn--cancel" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className="om-btn om-btn--confirm" onClick={handleConfirm} disabled={loading}>
                {loading ? "Enviando…" : "Confirmar encargo"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="om-success-icon" aria-hidden="true">✓</div>
            <h2 className="om-title">¡Encargo enviado!</h2>
            <p className="om-hint">
              Tu encargo se ha registrado correctamente. Puedes seguir su estado desde tu sección de encargos.
            </p>
            <div className="om-actions">
              <button className="om-btn om-btn--cancel" onClick={onClose}>
                Cerrar
              </button>
              <button className="om-btn om-btn--confirm" onClick={handleGoToOrders}>
                Ver mis encargos
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
