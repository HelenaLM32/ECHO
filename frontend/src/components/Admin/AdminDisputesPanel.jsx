import DisputePanel from "../DisputePanel";

export default function AdminDisputesPanel({
  selectedDispute,
  onBackToDisputes,
  filteredDisputes,
  searchDisputes,
  onSearchDisputesChange,
  onRefreshDisputes,
  onOpenDispute,
  onCreatorClick,
}) {
  if (selectedDispute) {
    return (
      <div>
        <button className="btn-secondary" onClick={onBackToDisputes}>
          ← Volver a disputas
        </button>
        <DisputePanel disputeId={selectedDispute} currentUserId={null} isAdmin={true} />
      </div>
    );
  }

  return (
    <div>
      <div className="disputes-controls">
        <h2>Disputas abiertas ({filteredDisputes.length})</h2>
        <div className="admin-disputes-actions">
          <input
            type="search"
            className="admin-search-input"
            placeholder="Buscar en disputas..."
            value={searchDisputes}
            onChange={(e) => onSearchDisputesChange(e.target.value)}
          />
          <button className="btn-secondary" onClick={onRefreshDisputes}>
            Refrescar
          </button>
        </div>
      </div>

      {filteredDisputes.length === 0 ? (
        <p>No hay disputas.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Orden</th>
              <th>Creada por</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.map((dispute) => {
              const creatorId =
                dispute.createdById ?? dispute.createdByUserId ?? dispute.createdBy ?? null;
              return (
                <tr key={dispute.id}>
                  <td>#{dispute.id}</td>
                  <td>#{dispute.orderId}</td>
                  <td>
                    {creatorId ? (
                      <button
                        type="button"
                        className="admin-user-link"
                        onClick={() => onCreatorClick(creatorId)}
                      >
                        @{dispute.createdByUsername}
                      </button>
                    ) : (
                      dispute.createdByUsername
                    )}
                  </td>
                  <td>{(dispute.reason || "").substring(0, 50)}...</td>
                  <td>
                    <span className={`status-badge ${dispute.status.toLowerCase()}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-primary" onClick={() => onOpenDispute(dispute.id)}>
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
