import React, { useState, useEffect } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import ProjectView from "../../pages/ItemProyect/ProjectView";
import { getAllProjects } from "../../services/projects";
import "./ItemsList.css";

function ItemsList({ searchQuery = "", selectedCategoryId = null, sortBy = "recent" }) {
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

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredProjects = projects
    .filter((p) => {
      if (selectedCategoryId == null) return true;
      const categoryId = p?.item?.categoryId;
      return Number(categoryId) === Number(selectedCategoryId);
    })
    .filter((p) => {
      if (!normalizedSearch) return true;
      const title = (p?.item?.title || "").toLowerCase();
      const description = (p?.item?.description || "").toLowerCase();
      const creatorName = (p?.profile?.publicName || p?.profile?.username || "").toLowerCase();
      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        creatorName.includes(normalizedSearch)
      );
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return (b?.likes || 0) - (a?.likes || 0);
      }
      if (sortBy === "views") {
        return (b?.views || 0) - (a?.views || 0);
      }
      return (b?.id || 0) - (a?.id || 0);
    });

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="items-list-container">
      {loadingProjects ? (
        <div className="empty-state">Cargando proyectos...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">No hay proyectos publicados.</div>
      ) : (
        filteredProjects.map((p) => (
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