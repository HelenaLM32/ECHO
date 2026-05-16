import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getReviewsByTarget,
  getAverageByTarget,
  createReview,
  deleteReview,
} from "../../services/venueEventReviews";
import "./VenueEventReviews.css";

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="ver-stars-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`ver-star-input ${(hover || value) >= star ? "active" : ""}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReadonlyStars({ value }) {
  return (
    <div className="ver-item-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`ver-item-star ${value >= star ? "" : "off"}`}>★</span>
      ))}
    </div>
  );
}

export default function VenueEventReviews({ targetId, targetType }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews]         = useState([]);
  const [average, setAverage]         = useState(null);
  const [count, setCount]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [score, setScore]             = useState(0);
  const [comment, setComment]         = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const userAlreadyReviewed = user
    ? reviews.some((r) => r.authorId === user.id)
    : false;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      getReviewsByTarget(targetId, targetType),
      getAverageByTarget(targetId, targetType),
    ])
      .then(([revs, avg]) => {
        if (mounted) {
          setReviews(revs || []);
          setAverage(avg.average);
          setCount(avg.count || 0);
        }
      })
      .catch((err) => { console.error("Error al cargar reviews:", err); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [targetId, targetType]);

  const refreshAverage = async () => {
    const avg = await getAverageByTarget(targetId, targetType);
    setAverage(avg.average);
  };

  const handleSubmit = async () => {
    if (!user) { navigate("/login"); return; }
    if (score === 0) { setError("Selecciona una puntuación"); return; }
    setSubmitting(true);
    setError("");
    try {
      const newReview = await createReview({ targetId, targetType, score, comment });
      setReviews((prev) => [newReview, ...prev]);
      setCount((c) => c + 1);
      setSuccess("¡Valoración publicada!");
      setScore(0);
      setComment("");
      await refreshAverage();
    } catch (e) {
      setError(e.message || "Error al publicar la valoración");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setCount((c) => c - 1);
      await refreshAverage();
    } catch (e) {
      setError(e.message || "Error al eliminar");
    }
  };

  return (
    <div className="ver-section">
      <div className="ver-header">
        <span className="ver-title">Valoraciones</span>
        {average !== null && count > 0 && (
          <div className="ver-avg-badge">
            <span className="ver-avg-star">★</span>
            <span className="ver-avg-num">{average.toFixed(1)}</span>
            <span className="ver-avg-count">({count})</span>
          </div>
        )}
      </div>

      {!userAlreadyReviewed && (
        <div className="ver-form">
          <StarRating value={score} onChange={setScore} />
          <textarea
            className="ver-textarea"
            placeholder="Escribe tu opinión (opcional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={800}
          />
          <div className="ver-form-footer">
            <span>
              {error   && <span className="ver-error">{error}</span>}
              {success && <span className="ver-success">{success}</span>}
            </span>
            <button
              className="ver-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Publicando..." : user ? "Publicar valoración" : "Inicia sesión para valorar"}
            </button>
          </div>
        </div>
      )}

      {userAlreadyReviewed && (
        <span className="ver-already">Ya has dejado una valoración aquí.</span>
      )}

      {loading ? (
        <p className="ver-loading">Cargando valoraciones...</p>
      ) : reviews.length === 0 ? (
        <p className="ver-empty">Todavía no hay valoraciones. ¡Sé el primero!</p>
      ) : (
        <div className="ver-list">
          {reviews.map((r) => (
            <div key={r.id} className="ver-item">
              <div className="ver-item-top">
                <div
                  className="ver-item-author"
                  onClick={() => navigate(`/profile/${r.authorId}`)}
                >
                  {r.authorAvatarUrl ? (
                    <img
                      src={r.authorAvatarUrl}
                      alt={r.authorName}
                      className="ver-item-avatar"
                    />
                  ) : (
                    <div className="ver-item-avatar ver-item-avatar--placeholder">
                      {(r.authorName || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="ver-item-name">
                    {r.authorName || `Usuario #${r.authorId}`}
                  </span>
                </div>
                <ReadonlyStars value={r.score} />
              </div>

              {r.comment && (
                <p className="ver-item-comment">{r.comment}</p>
              )}

              {user && user.id === r.authorId && (
                <button
                  className="ver-delete-btn"
                  onClick={() => handleDelete(r.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
