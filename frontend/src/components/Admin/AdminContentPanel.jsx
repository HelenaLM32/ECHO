export default function AdminContentPanel({
  searchContent,
  onSearchContentChange,
  contentTypeFilter,
  onContentTypeChange,
  contentEntries,
  onOpenContentDetail,
  onDeleteContent,
}) {
  return (
    <div className="admin-content-panel">
      <div className="admin-content-toolbar">
        <h2>Contenido completo</h2>
        <input
          type="search"
          className="admin-search-input"
          placeholder="Buscar por título, descripción o ID..."
          value={searchContent}
          onChange={(e) => onSearchContentChange(e.target.value)}
        />
        <div className="admin-content-filters" role="tablist" aria-label="Filtrar contenido">
          {[
            { key: "all", label: "Todos" },
            { key: "project", label: "Proyectos" },
            { key: "service", label: "Servicios" },
            { key: "venue", label: "Locales" },
            { key: "event", label: "Eventos" },
          ].map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`admin-content-filter-btn${contentTypeFilter === filter.key ? " active" : ""}`}
              onClick={() => onContentTypeChange(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-content-list">
        {contentEntries.map((entry) => (
          <article
            key={`${entry.type}-${entry.id}`}
            className="admin-content-item"
            role="button"
            tabIndex={0}
            onClick={() => onOpenContentDetail(entry)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenContentDetail(entry);
              }
            }}
          >
            <div>
              <span className={`admin-type-badge ${entry.type}`}>{entry.typeLabel}</span>
              <h3>{entry.title}</h3>
              <p>{entry.subtitle}</p>
            </div>
            <div className="admin-content-item-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenContentDetail(entry);
                }}
              >
                Ver detalle
              </button>
              <button
                type="button"
                className="admin-btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteContent(entry);
                }}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
        {contentEntries.length === 0 && (
          <p className="admin-empty">No hay elementos para este filtro.</p>
        )}
      </div>
    </div>
  );
}
