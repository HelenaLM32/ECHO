import { useState } from "react";
import { createDispute } from "../../services/disputes";

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Abrir disputa</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
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

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creando..." : "Crear disputa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDisputeModal;
