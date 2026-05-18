import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getProfileByUserId,
  updateAvatar,
  updateBanner,
  getProfileProducts,
  getProfileServices,
} from "../../services/profile";
import { getVenuesByUser, deleteVenue } from "../../services/venues";
import { getEventsByUser, deleteEvent } from "../../services/events";
import { deleteService } from "../../services/services";
import { getProjectsByUserId, deleteProject } from "../../services/projects";

import { getAverageByUser, getReviewsByUser } from "../../services/reviews";
import {
  getFollowStats,
  checkIsFollowing,
  followUser,
  unfollowUser,
} from "../../services/follows";

import ProjectCardWithLike from "../../components/Cards/ProjectCard/ProjectCardWithLike";
import ServiceCard from "../../components/Cards/ServiceCard/ServiceCard";
import VenueCard from "../../components/Cards/VenueCard/VenueCard";
import EventCard from "../../components/Cards/EventCard/EventCard";
import ProjectView from "../../pages/ItemProject/ProjectView";
import Footer from "../../components/Navigation/Footer/Footer";
import DetailModal from "../../components/Modals/DetailModal/DetailModal";
import ReviewsModal from "../../components/Modals/ReviewsModal/ReviewsModal";
import PopupConfirm from "../../components/Modals/PopupConfirm/PopupConfirm";
import PopupSuccess from "../../components/Modals/PopupSuccess/PopupSuccess";
import ServiceDetail from "../../components/ItemService/ServiceDetail/ServiceDetail";
import useConfirmPopup from "../../hooks/useConfirmPopup";
import useSuccessPopup from "../../hooks/useSuccessPopup";

import "./Profile.css";


export default function Profile() {
  const { user, loadingContext } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirmPopup();
  const { successState, showSuccess, hideSuccess } = useSuccessPopup();

  const targetId = id ? parseInt(id) : user?.id;
  const isOwnProfile = !id || parseInt(id) === user?.id;

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Proyectos");
  const [error, setError] = useState("");
  const [itemsLoading, setItemsLoading] = useState({
    products: false,
    services: false,
    venues: false,
    events: false,
    projects: false,
  });

  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({ average: null, count: 0 });
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const openModal = (type, data) => setModal({ open: true, type, data });
  const closeModal = () => setModal({ open: false, type: null, data: null });

  useEffect(() => {
    if (loadingContext) return;
    if (!targetId) {
      setError("No se pudo determinar el usuario");
      setLoading(false);
      return;
    }
    setLoading(true);
    getProfileByUserId(targetId)
      .then((data) => setProfile(data))
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, [targetId, loadingContext]);

  useEffect(() => {
    if (!targetId) return;
    getFollowStats(targetId).then(setFollowStats).catch((err) => { console.error("Error al obtener estadísticas de seguimiento:", err); });
    getAverageByUser(targetId)
      .then((data) => setReviewStats({ average: data.average, count: data.count ?? 0 }))
      .catch((err) => { console.error("Error al obtener promedio de reviews:", err); });

    if (user && !isOwnProfile) {
      checkIsFollowing(targetId).then((data) => setIsFollowing(data.following)).catch((err) => { console.error("Error al verificar estado de seguimiento:", err); });
    }
  }, [targetId, user, isOwnProfile]);

  useEffect(() => {
    if (!targetId || !profile) return;
    let mounted = true;

    const loadTabContent = async () => {
      switch (activeTab) {
        case "Productos":
          setItemsLoading(p => ({ ...p, products: true }));
          try { 
            const data = await getProfileProducts(targetId);
            if (mounted) setProducts(data);
          } catch { 
            if (mounted) setProducts([]);
          }
          if (mounted) setItemsLoading(p => ({ ...p, products: false }));
          break;
        case "Servicios":
          setItemsLoading(p => ({ ...p, services: true }));
          try { 
            const servicesData = await getProfileServices(targetId);
            if (mounted) setServices(servicesData);
          } catch { 
            if (mounted) setServices([]);
          }
          if (mounted) setItemsLoading(p => ({ ...p, services: false }));
          break;
        case "Locales":
          setItemsLoading(p => ({ ...p, venues: true }));
          try { 
            const data = await getVenuesByUser(targetId);
            if (mounted) setVenues(data);
          } catch { 
            if (mounted) setVenues([]);
          }
          if (mounted) setItemsLoading(p => ({ ...p, venues: false }));
          break;
        case "Eventos":
          setItemsLoading(p => ({ ...p, events: true }));
          try { 
            const data = await getEventsByUser(targetId);
            if (mounted) setEvents(data);
          } catch { 
            if (mounted) setEvents([]);
          }
          if (mounted) setItemsLoading(p => ({ ...p, events: false }));
          break;
        case "Proyectos":
          setItemsLoading(p => ({ ...p, projects: true }));
          try { 
            const data = await getProjectsByUserId(targetId);
            if (mounted) setProjects(data);
          } catch { 
            if (mounted) setProjects([]);
          }
          if (mounted) setItemsLoading(p => ({ ...p, projects: false }));
          break;
        default: break;
      }
    };
    loadTabContent();
    return () => { mounted = false; };
  }, [activeTab, targetId, profile]);

  useEffect(() => {
    if (activeTab !== "Proyectos" || !targetId) return;

    let mounted = true;
    const pollProjects = async () => {
      try {
        const updatedProjects = await getProjectsByUserId(targetId);
        if (!mounted) return;
        if (updatedProjects && Array.isArray(updatedProjects)) {
          setProjects((prev) => {
            const updatedMap = new Map(updatedProjects.map((p) => [p.id, p]));
            return prev.map((p) => updatedMap.get(p.id) || p);
          });
        }
      } catch (err) {
        if (mounted) console.error("Error en polling de proyectos:", err);
      }
    };

    const interval = setInterval(pollProjects, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeTab, targetId]);

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !isOwnProfile) return;
    try {
      const updated = await updateBanner(user.id, file);
      setProfile(updated);
    } catch {
      showSuccess("Error al guardar la portada", "Error");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !isOwnProfile) return;
    try {
      const updated = await updateAvatar(user.id, file);
      setProfile(updated);
    } catch {
      showSuccess("Error al guardar el avatar", "Error");
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetId);
        setIsFollowing(false);
      } else {
        await followUser(targetId);
        setIsFollowing(true);
      }
      setFollowStats(await getFollowStats(targetId));
    } catch (error) {
      showSuccess(error.message || "No se pudo completar la acción", "Error");
    }
    finally { setFollowLoading(false); }
  };

  // Elimina cualquier tipo de item (venue, event, service o project)
  // Recibe: el id del item, el tipo, la funcion de borrado y el setter del estado
  const handleDeleteItem = (id, type, deleteFn, setStateFn, itemName) => {
    showConfirm(
      `¿Eliminar este ${itemName}?`,
      "Confirmar eliminación",
      async () => {
        try {
          await deleteFn(id);
          setStateFn((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
          showSuccess(err.message || `No se pudo eliminar el ${itemName}`, "Error");
        }
      }
    );
  };

  // Wrappers específicos que usan la funcion generica
  const handleDeleteVenue = (id) => handleDeleteItem(id, 'venue', deleteVenue, setVenues, 'local');
  const handleDeleteEvent = (id) => handleDeleteItem(id, 'event', deleteEvent, setEvents, 'evento');
  const handleDeleteService = (id) => handleDeleteItem(id, 'service', deleteService, setServices, 'servicio');
  const handleDeleteProject = (id) => handleDeleteItem(id, 'project', deleteProject, setProjects, 'proyecto');

  const handleOpenReviews = () => {
    getReviewsByUser(targetId)
      .then((data) => { setReviews(data); setShowReviews(true); })
      .catch(() => setShowReviews(true));
  };

  const renderItemGrid = (items, isLoading, type) => {
    if (isLoading) return <div className="empty-state">Cargando...</div>;
    const path = type === "Productos" ? "/products/create" : "/services/create";
    return (
      <div>
        {isOwnProfile && (
          <button className="create-tab-btn" onClick={() => navigate(path)}>
            Crear {type.toLowerCase()}
          </button>
        )}
        {!items || items.length === 0 ? (
          <div className="empty-state">No hay {type.toLowerCase()} disponibles</div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-image-container">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="item-card-img" />
                  ) : (
                    <div className="item-card-img-placeholder">{item.title?.charAt(0)?.toUpperCase() || '?'}</div>
                  )}
                </div>
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-price">€{item.basePrice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

const renderVenues = () => {
  if (itemsLoading.venues) return <div className="empty-state">Cargando locales...</div>;

  return (
    <div className="projects-section">
      {isOwnProfile && (
        <button className="create-tab-btn" onClick={() => navigate("/venues/create")}>
          Crear un local
        </button>
      )}
      {venues.length === 0 ? (
        <div className="empty-state">Sin locales registrados</div>
      ) : (
        <div className="projects-grid">
          {venues.map((v) => (
            <div key={v.id} className="pc-card-container">
              <button
                type="button"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%' }}
                onClick={() => openModal("venue", v)}
              >
                <VenueCard venue={v} />
              </button>

              {isOwnProfile && (
                <div className="pc-admin-actions">
                  <button className="pc-btn-edit" onClick={(e) => { e.stopPropagation(); navigate(`/venues/${v.id}/edit`); }} aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14677 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.93083 19.9598 4.18821C20.0665 4.44558 20.1213 4.72143 20.1213 5C20.1213 5.27857 20.0665 5.55442 19.9598 5.81179C19.8532 6.06917 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                  <button className="pc-btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteVenue(v.id); }} aria-label="Eliminar">
                    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderEvents = () => {
  if (itemsLoading.events) return <div className="empty-state">Cargando eventos...</div>;

  return (
    <div className="projects-section">
      {isOwnProfile && (
        <button className="create-tab-btn" onClick={() => navigate("/events/create")}>
          Crear un evento
        </button>
      )}
      {events.length === 0 ? (
        <div className="empty-state">Sin eventos registrados</div>
      ) : (
        <div className="projects-grid">
          {events.map((ev) => (
            <div key={ev.id} className="pc-card-container">
              <button
                type="button"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%' }}
                onClick={() => openModal("event", ev)}
              >
                <EventCard event={ev} />
              </button>
              {isOwnProfile && (
                <div className="pc-admin-actions">
                  <button className="pc-btn-edit" onClick={(e) => { e.stopPropagation(); navigate(`/events/${ev.id}/edit`); }} aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14677 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.93083 19.9598 4.18821C20.0665 4.44558 20.1213 4.72143 20.1213 5C20.1213 5.27857 20.0665 5.55442 19.9598 5.81179C19.8532 6.06917 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                  <button className="pc-btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev.id); }} aria-label="Eliminar">
                    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

  const renderServices = () => {
    if (itemsLoading.services) return <div className="empty-state">Cargando...</div>;
    return (
      <div className="projects-section">
        {isOwnProfile && (
          <button className="create-tab-btn" onClick={() => navigate("/services/create")}>
            Crear servicio
          </button>
        )}
        {services.length === 0 ? (
          <div className="empty-state">Sin servicios registrados</div>
        ) : (
          <div className="projects-grid">
            {services.map((service) => (
              <div key={service.id} className="pc-card-container">
                <ServiceCard
                  service={service}
                  profile={profile}
                  onOpen={() => setSelectedService(service)}
                  small={true}
                />
                {isOwnProfile && (
                  <div className="pc-admin-actions">
                    <button className="pc-btn-edit" onClick={(e) => { e.stopPropagation(); navigate(`/services/${service.id}/edit`); }} aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14677 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.93083 19.9598 4.18821C20.0665 4.44558 20.1213 4.72143 20.1213 5C20.1213 5.27857 20.0665 5.55442 19.9598 5.81179C19.8532 6.06917 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                    <button className="pc-btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteService(service.id); }} aria-label="Eliminar">
                      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loadingContext || loading) return <div className="profile-page-loading">Cargando perfil...</div>;
  if (error || !profile) return <div className="profile-page-error">{error || "Perfil no encontrado"}</div>;

  const tabs = [
    "Proyectos",
    "Servicios",
    "Locales",
    "Eventos",
    "Calendario",
  ];

  return (
    <div className="profile-page">
      <header className="profile-banner-wrapper">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="Portada" className="banner-image" />
        ) : (
          <div
            className="banner-placeholder"
            onClick={() => isOwnProfile && bannerInputRef.current?.click()}
            style={{ cursor: isOwnProfile ? "pointer" : "default" }}
          >
            <p>Agregar imagen de portada</p>
          </div>
        )}
        {isOwnProfile && profile.bannerUrl && (
          <button className="banner-change-btn" onClick={() => bannerInputRef.current?.click()}>
            Cambiar portada
          </button>
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleBannerChange}
        />
      </header>

      <div className="avatar-float-wrapper">
        <div
          className={`avatar-container ${isOwnProfile ? "editable" : ""}`}
          onClick={() => isOwnProfile && avatarInputRef.current?.click()}
        >
          {profile.avatarUrl
            ? <img src={profile.avatarUrl} alt={profile.username} className="avatar-img" />
            : <div className="avatar-initials">{profile.username?.charAt(0).toUpperCase()}</div>}
          {isOwnProfile && <div className="avatar-overlay"><span>Cambiar</span></div>}
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </div>

      <div className="profile-layout-container">

        <aside className="profile-sidebar">
          <div className="sidebar-info">
            <h1 className="display-name">{profile.publicName || profile.username}</h1>
            <p className="username">@{profile.username}</p>
            <p className="display-location">{profile.location || "Ubicación no especificada"}</p>

            <button className="profile-rating-badge" onClick={handleOpenReviews}>
              <span className="profile-rating-star">★</span>
              <span className="profile-rating-avg">
                {reviewStats.average != null ? reviewStats.average.toFixed(1) : "—"}
              </span>
              <span className="profile-rating-count">({reviewStats.count})</span>
            </button>

            <div className="follow-stats">
              <span className="stat-item"><strong>{followStats.followers}</strong> seguidores</span>
              <span className="stat-item"><strong>{followStats.following}</strong> siguiendo</span>
            </div>

            {isOwnProfile ? (
              <Link to="/edit-profile" className="btn-edit-info">Editar perfil</Link>
            ) : user && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`btn-follow-action ${isFollowing ? "active" : ""}`}
              >
                {followLoading ? "..." : isFollowing ? "Dejar de seguir" : "Seguir"}
              </button>
            )}

            <p className="display-label">Sobre mí</p>
            <p className="display-bio">{profile.bio || "Sin descripción."}</p>

            {profile.experience && (
              <>
                <p className="display-label">Experiencia</p>
                <p className="display-bio">{profile.experience}</p>
              </>
            )}
          </div>
        </aside>

        <main className="profile-main">
          <div className="social-header">
           {profile.linkedin && (
  <a href={profile.linkedin} className="social-link" target="_blank" rel="noreferrer">
   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 256 256"><path fill="#3D3D3D" d="M216 24H40a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16Zm0 192H40V40h176v176ZM96 112v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm88 28v36a8 8 0 0 1-16 0v-36a20 20 0 0 0-40 0v36a8 8 0 0 1-16 0v-64a8 8 0 0 1 15.79-1.78A36 36 0 0 1 184 140Zm-84-56a12 12 0 1 1-12-12a12 12 0 0 1 12 12Z"/></svg>
  </a>
)}
            {profile.instagram && (
  <a href={profile.instagram} className="social-link" target="_blank" rel="noreferrer">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#3D3D3D" d="M17.34 5.46a1.2 1.2 0 1 0 1.2 1.2a1.2 1.2 0 0 0-1.2-1.2Zm4.6 2.42a7.59 7.59 0 0 0-.46-2.43a4.94 4.94 0 0 0-1.16-1.77a4.7 4.7 0 0 0-1.77-1.15a7.3 7.3 0 0 0-2.43-.47C15.06 2 14.72 2 12 2s-3.06 0-4.12.06a7.3 7.3 0 0 0-2.43.47a4.78 4.78 0 0 0-1.77 1.15a4.7 4.7 0 0 0-1.15 1.77a7.3 7.3 0 0 0-.47 2.43C2 8.94 2 9.28 2 12s0 3.06.06 4.12a7.3 7.3 0 0 0 .47 2.43a4.7 4.7 0 0 0 1.15 1.77a4.78 4.78 0 0 0 1.77 1.15a7.3 7.3 0 0 0 2.43.47C8.94 22 9.28 22 12 22s3.06 0 4.12-.06a7.3 7.3 0 0 0 2.43-.47a4.7 4.7 0 0 0 1.77-1.15a4.85 4.85 0 0 0 1.16-1.77a7.59 7.59 0 0 0 .46-2.43c0-1.06.06-1.4.06-4.12s0-3.06-.06-4.12ZM20.14 16a5.61 5.61 0 0 1-.34 1.86a3.06 3.06 0 0 1-.75 1.15a3.19 3.19 0 0 1-1.15.75a5.61 5.61 0 0 1-1.86.34c-1 .05-1.37.06-4 .06s-3 0-4-.06a5.73 5.73 0 0 1-1.94-.3a3.27 3.27 0 0 1-1.1-.75a3 3 0 0 1-.74-1.15a5.54 5.54 0 0 1-.4-1.9c0-1-.06-1.37-.06-4s0-3 .06-4a5.54 5.54 0 0 1 .35-1.9A3 3 0 0 1 5 5a3.14 3.14 0 0 1 1.1-.8A5.73 5.73 0 0 1 8 3.86c1 0 1.37-.06 4-.06s3 0 4 .06a5.61 5.61 0 0 1 1.86.34a3.06 3.06 0 0 1 1.19.8a3.06 3.06 0 0 1 .75 1.1a5.61 5.61 0 0 1 .34 1.9c.05 1 .06 1.37.06 4s-.01 3-.06 4ZM12 6.87A5.13 5.13 0 1 0 17.14 12A5.12 5.12 0 0 0 12 6.87Zm0 8.46A3.33 3.33 0 1 1 15.33 12A3.33 3.33 0 0 1 12 15.33Z"/></svg>
  </a>
)}

{profile.twitter && (
  <a href={profile.twitter} className="social-link" target="_blank" rel="noreferrer">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3D3D3D"><path fill="none" stroke="#3D3D3D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m13.081 10.712l-4.786-6.71a.6.6 0 0 0-.489-.252H5.28a.6.6 0 0 0-.488.948l6.127 8.59m2.162-2.576l6.127 8.59a.6.6 0 0 1-.488.948h-2.526a.6.6 0 0 1-.489-.252l-4.786-6.71m2.162-2.576l5.842-6.962m-8.004 9.538L5.077 20.25"/></svg>
  </a>
)}
          </div>

          <nav className="content-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {activeTab === "Proyectos" && (
              <div className="projects-section">
                {isOwnProfile && (
                  <button className="create-tab-btn" onClick={() => navigate("/projects/create")}>
                    Crear nuevo proyecto
                  </button>
                )}
                {itemsLoading.projects ? (
                  <div className="empty-state">Cargando...</div>
                ) : projects.length === 0 ? (
                  <div className="empty-state">Sin proyectos aún</div>
                ) : (
                  <div className="projects-grid">
                    {projects.map((p) => (
                      <div key={p.id} className="pc-card-container">
                        <ProjectCardWithLike project={p} onOpen={setSelectedProjectId} small={true} />
                        {isOwnProfile && (
                          <div className="pc-admin-actions">
                            <button className="pc-btn-edit" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${p.id}/edit`); }} aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H21M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14677 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.93083 19.9598 4.18821C20.0665 4.44558 20.1213 4.72143 20.1213 5C20.1213 5.27857 20.0665 5.55442 19.9598 5.81179C19.8532 6.06917 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                            <button className="pc-btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} aria-label="Eliminar">
                              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fillRule="evenodd"/>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Productos */}
            {activeTab === "Productos" && renderItemGrid(products, itemsLoading.products, "Productos")}

            {/* Servicios */}
            {activeTab === "Servicios" && renderServices()}

            {/* Locales */}
            {activeTab === "Locales" && renderVenues()}

            {/* Eventos */}
            {activeTab === "Eventos" && renderEvents()}

            {/* Calendario */}
            {activeTab === "Calendario" && (
              <div className="calendar-tab">
                {profile.calendarUrl ? (
                  <>
                    <p className="calendar-title">
                      Disponibilidad de {profile.publicName || profile.username}
                    </p>
                    <iframe
                      src={profile.calendarUrl}
                      className="calendar-iframe"
                      title="Google Calendar"
                    />
                  </>
                ) : (
                  <div className="empty-state">
                    {isOwnProfile ? (
                      <>
                        <p>Aún no has vinculado tu calendario.</p>
                        <Link
                          to="/edit-profile"
                          className="btn-edit-info"
                          style={{ marginTop: "12px", width: "auto", display: "inline-block" }}
                        >
                          Añadir calendario
                        </Link>
                      </>
                    ) : (
                      <p>Este usuario no ha vinculado su calendario.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showReviews && (
        <ReviewsModal
          reviews={reviews}
          average={reviewStats.average}
          count={reviewStats.count}
          onClose={() => setShowReviews(false)}
        />
      )}
      {selectedProjectId && (
        <ProjectView projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
      {selectedService && (
        <ServiceDetail service={selectedService} onClose={() => setSelectedService(null)} />
      )}
      {modal.open && (
        <DetailModal type={modal.type} data={modal.data} onClose={closeModal} />
      )}

      <PopupConfirm
        isOpen={confirmState.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={confirmState.message}
        title={confirmState.title}
      />

      <PopupSuccess
        isOpen={successState.isOpen}
        onClose={hideSuccess}
        message={successState.message}
        title={successState.title}
      />

      <Footer />
    </div>
  );
}
