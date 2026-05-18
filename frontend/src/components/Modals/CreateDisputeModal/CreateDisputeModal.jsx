import { useState } from "react";
import { createDispute } from "../../../services/disputes";

const CreateDisputeModal = ({ orderId, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim() || reason.length < 10) {
      setError("La razón debe tener al menos 10 caracteres");
      return;
    }

    setLoading(true);
    try {
      const data = await createDispute(orderId, reason);
      setError(null);
      onSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-dispute-modal-overlay">
      <button className="create-dispute-close-btn" onClick={onClose} aria-label="Cerrar">
        <svg className="create-dispute-close-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"/>
        </svg>
      </button>
      <div className="create-dispute-modal-content">
        <div className="create-dispute-modal-header">
          <h2>Abrir disputa</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="create-dispute-form-group">
            <label htmlFor="reason">Motivo de la disputa</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe el motivo de la disputa con detalle (mínimo 10 caracteres)..."
              rows="5"
              required
            />
            <small>Mínimo 10 caracteres</small>
          </div>

          {error && <div className="create-dispute-error-message">{error}</div>}

          <div className="create-dispute-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="create-dispute-btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="create-dispute-btn-primary">
              {loading ? "Creando..." : "Crear disputa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDisputeModal;
