import React, { useState, useEffect } from "react";
import ProjectCardWithLike from "../../components/Cards/ProjectCard/ProjectCardWithLike";
import ServiceCard from "../../components/Cards/ServiceCard/ServiceCard";
import VenueCard from "../../components/Cards/VenueCard/VenueCard";
import EventCard from "../../components/Cards/EventCard/EventCard";
import ProfileCard from "../../components/Cards/ProfileCard/ProfileCard";
import ProjectView from "../../pages/ItemProject/ProjectView";
import ServiceDetail from "../../components/ItemService/ServiceDetail/ServiceDetail";
import { getAllProjects } from "../../services/projects";
import { getAllServices } from "../../services/services";
import { getAllVenues } from "../../services/venues";
import { getAllEvents } from "../../services/events";
import { getAllProfiles } from "../../services/profile";
import DetailModal from "../Modals/DetailModal/DetailModal";
import "./ItemsList.css";

function ItemsList({ searchQuery = "", selectedCategoryId = null, sortBy = "recent", contentType = "proyectos" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    setItems([]);

    const fetchers = {
      proyectos: getAllProjects,
      servicios: getAllServices,
      locales: getAllVenues,
      eventos: getAllEvents,
      perfiles: getAllProfiles,
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

  useEffect(() => {
    const pollItems = () => {
      Promise.all([
        getAllProjects(),
        getAllServices()
      ])
        .then(([projectsList, servicesList]) => {
          setItems((prevItems) => {
            const updatedProjectsMap = new Map((projectsList || []).map((p) => [p.id, p]));
            const updatedServicesMap = new Map((servicesList || []).map((s) => [s.id, s]));
            
            return prevItems.map((item) => {
              // Check if item is a project
              if (item?.item?.type === 'project' || item?.type === 'project') {
                const updated = updatedProjectsMap.get(item.id);
                return updated || item;
              }
              // Check if item is a service
              if (item?.item?.type === 'service' || item?.type === 'service') {
                const updated = updatedServicesMap.get(item.id);
                return updated || item;
              }
              return item;
            });
          });
        })
        .catch((err) => { console.error("Error en polling de items:", err); });
    };

    const interval = setInterval(pollItems, 30000);
    return () => clearInterval(interval);
  }, []);

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
      if (contentType === "locales")
    return <VenueCard key={item.id} venue={item} onOpen={setSelectedVenue} />;
  if (contentType === "eventos")
    return <EventCard key={item.id} event={item} onOpen={setSelectedEvent} />;
      if (contentType === "perfiles") {
        const name = (item?.publicName || "").toLowerCase();
        const username = (item?.username || "").toLowerCase();
        const bio = (item?.bio || "").toLowerCase();
        const location = (item?.location || "").toLowerCase();
        return name.includes(normalizedSearch) || username.includes(normalizedSearch) || bio.includes(normalizedSearch) || location.includes(normalizedSearch);
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
    perfiles: "perfiles",
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
            return <ProjectCardWithLike key={item.id} project={item} onOpen={setSelectedProjectId} />;
          }
          if (contentType === "servicios") {
            const profile = {
              publicName: item.creatorName,
              username: item.creatorName,
              avatarUrl: item.creatorAvatarUrl,
            };
            return <ServiceCard key={item.id} service={item} profile={profile} onOpen={() => setSelectedService(item)} />;
          }
         if (contentType === "locales") {
  return <VenueCard key={item.id} venue={item} onOpen={setSelectedVenue} />;
}
if (contentType === "eventos") {
  return <EventCard key={item.id} event={item} onOpen={setSelectedEvent} />;
}
          if (contentType === "perfiles") {
            return <ProfileCard key={item.userId || item.id} profile={item} />;
          }
          return null;
        })
      )}
      {selectedProjectId && (
        <ProjectView projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
      {selectedService && (
        <ServiceDetail service={selectedService} onClose={() => setSelectedService(null)} />
      )}
      {selectedVenue && (
  <DetailModal type="venue" data={selectedVenue} onClose={() => setSelectedVenue(null)} />
)}
{selectedEvent && (
  <DetailModal type="event" data={selectedEvent} onClose={() => setSelectedEvent(null)} />
)}
    </div>
  );
}

export default ItemsList;
