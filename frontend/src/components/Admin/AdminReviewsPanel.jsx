export default function AdminReviewsPanel({
  filteredReviews,
  searchReviews,
  onSearchReviewsChange,
  onDeleteReview,
  onAuthorClick,
}) {
  return (
    <div className="admin-reviews">
      <div className="admin-section-toolbar">
        <h2>Reviews ({filteredReviews.length})</h2>
        <input
          type="search"
          className="admin-search-input"
          placeholder="Buscar por autor, comentario o ID..."
          value={searchReviews}
          onChange={(e) => onSearchReviewsChange(e.target.value)}
        />
      </div>
      {filteredReviews.length === 0 ? (
        <p className="admin-empty">No hay reviews registradas.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Encargo</th>
              <th>Autor</th>
              <th>Puntuación</th>
              <th>Comentario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td>#{review.id}</td>
                <td>#{review.orderId}</td>
                <td>
                  {review.authorId ? (
                    <button
                      type="button"
                      className="admin-user-link"
                      onClick={() => onAuthorClick(review.authorId)}
                    >
                      @{review.authorUsername ?? review.authorId}
                    </button>
                  ) : (
                    <span>@{review.authorUsername ?? "usuario"}</span>
                  )}
                </td>
                <td>{"★".repeat(review.score)}{"☆".repeat(5 - review.score)}</td>
                <td className="admin-review-comment">{review.comment || "—"}</td>
                <td>
                  <button
                    className="admin-btn-danger"
                    onClick={() => onDeleteReview(review.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
