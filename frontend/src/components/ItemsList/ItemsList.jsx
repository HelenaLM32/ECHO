import React, { useState, useEffect } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import VenueCard from "../../components/VenueCard/VenueCard";
import EventCard from "../../components/EventCard/EventCard";
import ProjectView from "../../pages/ItemProyect/ProjectView";
import { getAllProjects } from "../../services/projects";
import { getAllServices } from "../../services/servicesApi";
import { getAllVenues } from "../../services/venues";
import { getAllEvents } from "../../services/events";
import "./ItemsList.css";

function ItemsList({ searchQuery = "", selectedCategoryId = null, sortBy = "recent", contentType = "proyectos" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    setItems([]);

    const fetchers = {
      proyectos: getAllProjects,
      servicios: getAllServices,
      locales: getAllVenues,
      eventos: getAllEvents,
    };

    const fetcher = fetchers[contentType] || getAllProjects;

    fetcher()
      .then((list) => setItems(list || []))
      .catch(() => {
        setError("No se pudieron cargar los resultados");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [contentType]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredItems = items
    .filter((item) => {
      if (contentType === "proyectos") {
        if (selectedCategoryId == null) return true;
        return Number(item?.item?.categoryId) === Number(selectedCategoryId);
      }
      if (contentType === "servicios") {
        if (selectedCategoryId == null) return true;
        return Number(item?.categoryId) === Number(selectedCategoryId);
      }
      return true;
    })
    .filter((item) => {
      if (!normalizedSearch) return true;
      if (contentType === "proyectos") {
        const title = (item?.item?.title || "").toLowerCase();
        const description = (item?.item?.description || "").toLowerCase();
        const creator = (item?.profile?.publicName || item?.profile?.username || "").toLowerCase();
        return title.includes(normalizedSearch) || description.includes(normalizedSearch) || creator.includes(normalizedSearch);
      }
      if (contentType === "servicios") {
        const name = (item?.name || "").toLowerCase();
        const desc = (item?.description || "").toLowerCase();
        const creator = (item?.creatorName || "").toLowerCase();
        return name.includes(normalizedSearch) || desc.includes(normalizedSearch) || creator.includes(normalizedSearch);
      }
      if (contentType === "locales") {
        const name = (item?.name || "").toLowerCase();
        const address = (item?.address || "").toLowerCase();
        return name.includes(normalizedSearch) || address.includes(normalizedSearch);
      }
      if (contentType === "eventos") {
        const title = (item?.title || "").toLowerCase();
        const desc = (item?.description || "").toLowerCase();
        return title.includes(normalizedSearch) || desc.includes(normalizedSearch);
      }
      return true;
    })
    .sort((a, b) => {
      if (contentType !== "proyectos") return (b?.id || 0) - (a?.id || 0);
      if (sortBy === "popular") return (b?.likes || 0) - (a?.likes || 0);
      if (sortBy === "views") return (b?.views || 0) - (a?.views || 0);
      return (b?.id || 0) - (a?.id || 0);
    });

  const typeLabels = {
    proyectos: "proyectos",
    servicios: "servicios",
    locales: "locales",
    eventos: "eventos",
  };

  const emptyLabel = typeLabels[contentType] || "resultados";

  if (error) return <p className="empty-state">Error: {error}</p>;

  return (
    <div className="items-list-container">
      {loading ? (
        <div className="empty-state">Cargando {emptyLabel}...</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">No hay {emptyLabel} publicados.</div>
      ) : (
        filteredItems.map((item) => {
          if (contentType === "proyectos") {
            return <ProjectCard key={item.id} project={item} onOpen={setSelectedProjectId} />;
          }
          if (contentType === "servicios") {
            const profile = {
              publicName: item.creatorName,
              username: item.creatorName,
              avatarUrl: item.creatorAvatarUrl,
            };
            return <ServiceCard key={item.id} service={item} profile={profile} small={true} />;
          }
          if (contentType === "locales") {
            return <VenueCard key={item.id} venue={item} />;
          }
          if (contentType === "eventos") {
            return <EventCard key={item.id} event={item} />;
          }
          return null;
        })
      )}
      {selectedProjectId && (
        <ProjectView projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
    </div>
  );
}

export default ItemsList;
