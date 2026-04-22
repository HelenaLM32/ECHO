import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDisputeById,
  addMessageToDispute,
  closeDispute,
} from "../services/disputes";
import "../styles/globals.css";

const DisputePanel = ({ disputeId, currentUserId, isAdmin }) => {
  const [dispute, setDispute] = useState(null);
  const [message, setMessage] = useState("");
  const [resolution, setResolution] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDispute();
  }, [disputeId]);

  const loadDispute = async () => {
    try {
      const data = await getDisputeById(disputeId);
      setDispute(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("El mensaje no puede estar vacío");
      return;
    }

    try {
      await addMessageToDispute(disputeId, message);
      setMessage("");
      await loadDispute();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseDispute = async (e) => {
    e.preventDefault();
    if (!resolution.trim()) {
      alert("La resolución no puede estar vacía");
      return;
    }

    try {
      await closeDispute(disputeId, resolution);
      setResolution("");
      setShowCloseForm(false);
      await loadDispute();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando disputa...</div>;

  if (error)
    return <div className="error">Error: {error}</div>;

  if (!dispute) return <div>Disputa no encontrada</div>;

  const canClose = isAdmin && dispute.status === "OPEN";
  const canMessage = dispute.status === "OPEN";

  return (
    <div className="dispute-panel">
      <div className="dispute-header">
        <h2>Disputa #{dispute.id}</h2>
        <p>
          Estado:{" "}
          <span
            className={`status-badge ${dispute.status.toLowerCase()}`}
          >
            {dispute.status}
          </span>
        </p>
        <p>
          <strong>Orden:</strong> #{dispute.orderId}
        </p>
        <p>
          <strong>Creada por:</strong> {dispute.createdByUsername}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(dispute.createdAt).toLocaleString("es-ES")}
        </p>
      </div>

      <div className="dispute-reason">
        <h3>Motivo de la disputa</h3>
        <p>{dispute.reason}</p>
      </div>

      {dispute.resolution && (
        <div className="dispute-resolution">
          <h3>Resolución</h3>
          <p>{dispute.resolution}</p>
        </div>
      )}

      <div className="dispute-messages">
        <h3>Mensajes</h3>
        <div className="messages-list">
          {dispute.messages && dispute.messages.length > 0 ? (
            dispute.messages.map((msg) => (
              <div key={msg.id} className="message-item">
                <div className="message-header">
                  <strong>{msg.username}</strong>
                  <span className="message-date">
                    {new Date(msg.createdAt).toLocaleString("es-ES")}
                  </span>
                </div>
                <div className="message-content">{msg.message}</div>
              </div>
            ))
          ) : (
            <p>No hay mensajes aún</p>
          )}
        </div>
      </div>

      {canMessage && (
        <form onSubmit={handleAddMessage} className="message-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            rows="4"
            required
          />
          <button type="submit">Enviar mensaje</button>
        </form>
      )}

      {canClose && (
        <div className="close-dispute-section">
          {!showCloseForm ? (
            <button
              onClick={() => setShowCloseForm(true)}
              className="btn-close-dispute"
            >
              Cerrar disputa
            </button>
          ) : (
            <form onSubmit={handleCloseDispute} className="close-form">
              <h3>Cerrar disputa</h3>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Escribe la resolución..."
                rows="4"
                required
              />
              <div className="form-actions">
                <button type="submit">Confirmar cierre</button>
                <button
                  type="button"
                  onClick={() => setShowCloseForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default DisputePanel;
