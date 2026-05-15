import { createPortal } from "react-dom";
import "./ReviewsModal.css";

export default function ReviewsModal({ reviews, average, count, onClose }) {
  return createPortal(
    <div className="rmodal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="reviews-modal-title">
      <div className="rmodal" onClick={(e) => e.stopPropagation()}>
        <button className="rmodal-close" onClick={onClose} aria-label="Cerrar modal">✕</button>

        <h2 id="reviews-modal-title" className="rmodal-title">Valoraciones</h2>

        <div className="rmodal-summary">
          <span className="rmodal-avg">{average != null ? average.toFixed(1) : "—"}</span>
          <div className="rmodal-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={s <= Math.round(average ?? 0) ? "rmodal-star rmodal-star--filled" : "rmodal-star"}>★</span>
            ))}
          </div>
          <span className="rmodal-count">{count} valoración{count !== 1 ? "es" : ""}</span>
        </div>

        <ul className="rmodal-list">
          {reviews.length === 0 && (
            <li className="rmodal-empty">Aún no hay valoraciones.</li>
          )}
          {reviews.map((r) => (
            <li key={r.id} className="rmodal-item">
              <div className="rmodal-item__header">
                <span className="rmodal-item__author">@{r.authorUsername ?? "usuario"}</span>
                <span className="rmodal-item__score">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= r.score ? "rmodal-star rmodal-star--filled" : "rmodal-star"}>★</span>
                  ))}
                </span>
              </div>
              {r.comment && <p className="rmodal-item__comment">"{r.comment}"</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
}
