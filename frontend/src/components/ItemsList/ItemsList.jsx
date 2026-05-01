import React, { useState, useEffect } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import ProjectView from "../../pages/ItemProyect/ProjectView";
import { getAllProjects } from "../../services/projects";
import "./ItemsList.css";

function ItemsList() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    setLoadingProjects(true);
    getAllProjects()
      .then((list) => {
        console.debug("Fetched all projects", list);
        setProjects(list || []);
      })
      .catch((err) => {
        console.debug("Failed to fetch projects", err);
        setError("No se pudieron cargar los proyectos");
        setProjects([]);
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="items-list-container">
      {loadingProjects ? (
        <div className="empty-state">Cargando proyectos...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">No hay proyectos publicados.</div>
      ) : (
        projects.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={setSelectedProjectId} />
        ))
      )}
      {selectedProjectId && (
        <ProjectView projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
    </div>
  );
}

export default ItemsList;