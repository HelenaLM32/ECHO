export default function AdminBasicTable({
  view,
  data,
  filteredUsers,
  searchUsers,
  onSearchUsersChange,
  onDelete,
  onUserClick,
}) {
  const rows = view === "users" ? filteredUsers : data;

  return (
    <div>
      {view === "users" && (
        <div className="admin-section-toolbar">
          <h2>Usuarios ({filteredUsers.length})</h2>
          <input
            type="search"
            className="admin-search-input"
            placeholder="Buscar por id, email o username..."
            value={searchUsers}
            onChange={(e) => onSearchUsersChange(e.target.value)}
          />
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{view === "users" ? "Email / Usuario" : "Título"}</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {view === "users" ? (
                  <button
                    type="button"
                    className="admin-user-link"
                    onClick={() => onUserClick(item.id)}
                  >
                    {item.email} - @{item.username}
                  </button>
                ) : (
                  item.title
                )}
              </td>
              <td>
                <button className="btn-delete" onClick={() => onDelete(item.id)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan="3">No hay registros.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
