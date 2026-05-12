import React, { useState, useEffect } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import ProjectView from "../../pages/ItemProyect/ProjectView";
import ServiceDetail from "../../components/ServiceDetail/ServiceDetail";
import { getAllProjects } from "../../services/projects";
import { getAllServices } from "../../services/servicesApi";
import "./ItemsList.css";

function ItemsList({ searchQuery = "", selectedCategoryId = null, sortBy = "recent" }) {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    setLoadingProjects(true);
    Promise.all([
      getAllProjects(),
      getAllServices()
    ])
      .then(([projectsList, servicesList]) => {
        setProjects(projectsList || []);
        setServices(servicesList || []);
      })
      .catch((err) => {
        setError("No se pudieron cargar los items");
        setProjects([]);
        setServices([]);
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  // Poll for updated projects and services every 30 seconds to refresh views/likes in real-time
  useEffect(() => {
    const pollItems = () => {
      Promise.all([
        getAllProjects(),
        getAllServices()
      ])
        .then(([projectsList, servicesList]) => {
          if (projectsList && Array.isArray(projectsList)) {
            setProjects((prev) => {
              const updatedMap = new Map(projectsList.map((p) => [p.id, p]));
              return prev.map((p) => updatedMap.get(p.id) || p);
            });
          }
          if (servicesList && Array.isArray(servicesList)) {
            setServices((prev) => {
              const updatedMap = new Map(servicesList.map((s) => [s.id, s]));
              return prev.map((s) => updatedMap.get(s.id) || s);
            });
          }
        })
        .catch(() => { });
    };

    const interval = setInterval(pollItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  // Filter and prepare projects
  const filteredProjects = (projects || [])
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
    .map((p) => ({ ...p, itemType: 'project' }));

  // Filter services
  const filteredServices = (services || [])
    .filter((s) => {
      if (selectedCategoryId == null) return true;
      const categoryId = s?.categoryId;
      return Number(categoryId) === Number(selectedCategoryId);
    })
    .filter((s) => {
      if (!normalizedSearch) return true;
      const title = (s?.name || "").toLowerCase();
      const description = (s?.description || "").toLowerCase();
      const creatorName = (s?.creator?.publicName || s?.creator?.username || "").toLowerCase();
      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        creatorName.includes(normalizedSearch)
      );
    })
    .map((s) => ({ ...s, itemType: 'service' }));

  // Combine and sort all items
  const allItems = [...filteredProjects, ...filteredServices].sort((a, b) => {
    if (sortBy === "popular") {
      const aPopularity = (a?.likes || 0) + (a?.views || 0);
      const bPopularity = (b?.likes || 0) + (b?.views || 0);
      return bPopularity - aPopularity;
    }
    if (sortBy === "views") {
      return (b?.views || 0) - (a?.views || 0);
    }
    // Default: recent (by id descending)
    return (b?.id || 0) - (a?.id || 0);
  });

  const selectedService = selectedServiceId ? services.find(s => s.id === selectedServiceId) : null;

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="items-list-container">
      {loadingProjects ? (
        <div className="empty-state">Cargando items...</div>
      ) : allItems.length === 0 ? (
        <div className="empty-state">No hay items publicados.</div>
      ) : (
        allItems.map((item) => (
          item.itemType === 'project' ? (
            <ProjectCard key={`project-${item.id}`} project={item} onOpen={setSelectedProjectId} />
          ) : (
            <ServiceCard key={`service-${item.id}`} service={item} onOpen={setSelectedServiceId} />
          )
        ))
      )}
      {selectedProjectId && (
        <ProjectView projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
      {selectedService && (
        <ServiceDetail service={selectedService} onClose={() => setSelectedServiceId(null)} />
      )}
    </div>
  );
}

export default ItemsList;
