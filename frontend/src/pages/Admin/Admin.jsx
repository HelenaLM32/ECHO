import { useState, useEffect } from "react";
import { fetchWithToken } from "../../services/config";
import "./Admin.css";

export default function Admin() {
  const [view, setView] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData(view);
  }, [view]);

const loadData = async (currentView) => {
    setLoading(true);
    try {
      const endpoint = currentView === "users" ? "/users" : "/items";
      const res = await fetchWithToken(endpoint);
      const json = await res.json();
      
      console.log("Respuesta del servidor:", json);
      
      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.warn("El servidor no devolvió una lista válida.");
        setData([]);
      }
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar este registro?")) return;

    try {
      const endpoint = view === "users" ? `/users/${id}` : `/items/${id}`;
      await fetchWithToken(endpoint, { method: "DELETE" });
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      alert("Fallo al ejecutar el borrado.");
    }
  };

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      
      <div className="admin-tabs">
        <button 
          className={view === "users" ? "active" : ""} 
          onClick={() => setView("users")}
        >
          Usuarios
        </button>
        <button 
          className={view === "items" ? "active" : ""} 
          onClick={() => setView("items")}
        >
          Contenido
        </button>
      </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{view === "users" ? "Email / Usuario" : "Título"}</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{view === "users" ? `${item.email} - ${item.username}` : item.title}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="3">No hay registros.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}