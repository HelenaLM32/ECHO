import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrderById, updateOrderStatus } from "../../services/orders";
import { createReview, getReviewByOrder } from "../../services/reviews";
import OrderBoard from "../../components/OrderBoard/OrderBoard";
import PopupConfirm from "../../components/Modals/PopupConfirm/PopupConfirm";
import useConfirmPopup from "../../hooks/useConfirmPopup";
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
  const { id } = useParams();
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const { confirmState, showConfirm, handleConfirm, handleCancel: handleConfirmCancel } = useConfirmPopup();

  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [updating, setUpdating] = useState(false);

  const [review, setReview]               = useState(undefined); // undefined = not loaded yet
  const [reviewScore, setReviewScore]     = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError]     = useState("");

  useEffect(() => {
    setLoading(true);
    getOrderById(Number(id))
      .then(setOrder)
      .catch((e) => setError(e.message || "No se pudo cargar el encargo"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!order || order.status !== "COMPLETED") return;
    getReviewByOrder(Number(id))
      .then(setReview)
      .catch(() => setReview(null));
  }, [order, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewScore === 0) { setReviewError("Selecciona una puntuación"); return; }
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const saved = await createReview(Number(id), reviewScore, reviewComment);
      setReview(saved);
    } catch (err) {
      setReviewError(err.message || "Error al enviar la review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setError("");
    try {
      const updated = await updateOrderStatus(Number(id), newStatus);
      setOrder(updated);
    } catch (e) {
      setError(e.message || "Error al actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async (orderId) => {
    setUpdating(true);
    setError("");
    try {
      const updated = await updateOrderStatus(Number(orderId), "CANCELLED");
      setOrder(updated);
    } catch (e) {
      setError(e.message || "Error al cancelar el encargo");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelRequest = (id) => {
    showConfirm(
      "¿Seguro que quieres cancelar este encargo?",
      "Cancelar encargo",
      () => handleCancel(id)
    );
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
  const canReview = isBuyer && order?.status === "COMPLETED";

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

          {(isBuyer || isCreator) && (
            <button className="od-dispute-link" onClick={() => navigate(`/orders/${order.id}/dispute`)}>
              {order.hasDispute ? "Ver disputa" : "Abrir una disputa"}
            </button>
          )}

          {isCreator && order?.status !== "CANCELLED" && (
            <button
              className="od-cancel-btn"
              onClick={() => handleCancelRequest(order.id)}
              disabled={updating}
            >
              {updating ? "Cancelando..." : "Cancelar encargo"}
            </button>
          )}

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

      {canReview && (
        <div className="od-review-section">
          <h2 className="od-review-title">Valorar encargo</h2>

          {review === undefined && (
            <p className="od-review-loading">Cargando…</p>
          )}

          {review !== null && review !== undefined && (
            <div className="od-review-existing">
              <p className="od-review-existing__label">Tu valoración</p>
              <div className="od-stars od-stars--static">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= review.score ? "od-star od-star--filled" : "od-star"}>★</span>
                ))}
              </div>
              {review.comment && <p className="od-review-existing__comment">"{review.comment}"</p>}
            </div>
          )}

          {review === null && (
            <form className="od-review-form" onSubmit={handleReviewSubmit}>
              <div className="od-stars od-stars--interactive">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={s <= reviewScore ? "od-star od-star--filled" : "od-star"}
                    onClick={() => setReviewScore(s)}
                    aria-label={`${s} estrella${s > 1 ? "s" : ""}`}
                  >★</button>
                ))}
              </div>

              <textarea
                className="od-review-comment"
                placeholder="Deja un comentario (opcional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                maxLength={500}
              />

              {reviewError && <p className="od-review-error">{reviewError}</p>}

              <button
                type="submit"
                className="od-review-submit"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Enviando…" : "Enviar valoración"}
              </button>
            </form>
          )}
        </div>
      )}

      <PopupConfirm
        isOpen={confirmState.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleConfirmCancel}
        message={confirmState.message}
        title={confirmState.title}
        confirmText="Si, cancelar"
        cancelText="Volver"
      />
    </div>
  );
}
