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
import { getVenuesByUser } from "../../services/venues";
import { getEventsByUser } from "../../services/events";
import linkedinIcon from "../../assets/icons8-linkedin-24.png";
import twitterIcon from "../../assets/icons8-x-24.png";
import instagramIcon from "../../assets/icons8-instagram-24.png";
import Footer from "../../components/Footer/Footer";
import "./Profile.css";
import {
  getFollowStats,
  checkIsFollowing,
  followUser,
  unfollowUser,
} from "../../services/follows";

export default function Profile() {
  const { user, loadingContext } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const targetId = userId ? parseInt(userId) : user?.id;
  const isOwnProfile = !userId || parseInt(userId) === user?.id;

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState({
    products: false,
    services: false,
    venues: false,
    events: false,
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Productos");
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (loadingContext) return;
    if (!targetId) {
      setError("No se pudo determinar el usuario");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    getProfileByUserId(targetId)
      .then((data) => setProfile(data))
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, [targetId, loadingContext]);

  useEffect(() => {
    if (!targetId || !profile) return;
    const loadTabContent = async () => {
      if (activeTab === "Productos") {
        setItemsLoading((prev) => ({ ...prev, products: true }));
        try { const data = await getProfileProducts(targetId); setProducts(data); } 
        catch { setProducts([]); }
        finally { setItemsLoading((prev) => ({ ...prev, products: false })); }
      } else if (activeTab === "Servicios") {
        setItemsLoading((prev) => ({ ...prev, services: true }));
        try { const data = await getProfileServices(targetId); setServices(data); } 
        catch { setServices([]); }
        finally { setItemsLoading((prev) => ({ ...prev, services: false })); }
      } else if (activeTab === "Locales") {
        setItemsLoading((prev) => ({ ...prev, venues: true }));
        try { const data = await getVenuesByUser(targetId); setVenues(data); } 
        catch { setVenues([]); }
        finally { setItemsLoading((prev) => ({ ...prev, venues: false })); }
      } else if (activeTab === "Eventos") {
        setItemsLoading((prev) => ({ ...prev, events: true }));
        try { const data = await getEventsByUser(targetId); setEvents(data); } 
        catch { setEvents([]); }
        finally { setItemsLoading((prev) => ({ ...prev, events: false })); }
      }
    };
    loadTabContent();
  }, [activeTab, targetId, profile]);

  useEffect(() => {
    if (!targetId) return;
    getFollowStats(targetId).then(setFollowStats).catch(() => {});
    if (user && !isOwnProfile) {
      checkIsFollowing(targetId).then((data) => setIsFollowing(data.following)).catch(() => {});
    }
  }, [targetId, user, isOwnProfile]);

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const updated = await updateBanner(user.id, file);
      setProfile(updated);
    } catch { alert("Error al guardar la portada"); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const updated = await updateAvatar(user.id, file);
      setProfile(updated);
    } catch { alert("Error al guardar el avatar"); }
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
      const stats = await getFollowStats(targetId);
      setFollowStats(stats);
    } catch (error) { alert(error.message); } 
    finally { setFollowLoading(false); }
  };

  const renderItemGrid = (items, isLoading, type) => {
    if (isLoading) return <div className="empty-state">Cargando...</div>;
    const path = type === "Productos" ? "/products/create" : "/services/create";
    const label = type === "Productos" ? "un producto" : "un servicio";
    const icon = type === "Productos" ? "📦" : "🛠️";

    return (
      <div>
        {isOwnProfile && (
          <button className="create-tab-btn" onClick={() => navigate(path)}>
            <span className="create-icon"></span> Crear {label}
          </button>
        )}
        {!items || items.length === 0 ? (
          <div className="empty-state">No hay {type.toLowerCase()} disponibles</div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-image-placeholder">{icon}</div>
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
    if (itemsLoading.venues) return <div className="empty-state">Cargando...</div>;
    return (
      <div>
        {isOwnProfile && (
          <button className="create-tab-btn" onClick={() => navigate("/venues/create")}>
            <span className="create-icon"></span> Crear un local
          </button>
        )}
        {venues.length === 0 ? (
          <div className="empty-state">Sin locales registrados</div>
        ) : (
          <div className="items-grid">
            {venues.map((v) => (
              <div key={v.id} className="item-card">
                <div className="item-image-placeholder">🏠</div>
                <div className="item-info">
                  <h3 className="item-title">{v.name}</h3>
                  <p className="item-address">{v.address}</p>
                  {v.capacity && <p className="item-extra">Aforo: {v.capacity}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEvents = () => {
    if (itemsLoading.events) return <div className="empty-state">Cargando...</div>;
    return (
      <div>
        {isOwnProfile && (
          <button className="create-tab-btn" onClick={() => navigate("/events/create")}>
            <span className="create-icon"></span> Crear un evento
          </button>
        )}
        {events.length === 0 ? (
          <div className="empty-state">Sin eventos registrados</div>
        ) : (
          <div className="items-grid">
            {events.map((ev) => (
              <div key={ev.id} className="item-card">
                <div className="item-image-placeholder">🎭</div>
                <div className="item-info">
                  <h3 className="item-title">{ev.title || "Evento sin título"}</h3>
                  <p className="item-price">
                    {ev.startDate ? new Date(ev.startDate).toLocaleDateString("es-ES") : "Fecha no definida"}
                  </p>
                  <p className="item-extra">Estado: {ev.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loadingContext || loading) return <div className="profile-page-loading">Cargando perfil...</div>;
  if (error || !profile) return <div className="profile-page-error">{error || "Perfil no encontrado"}</div>;

  const tabs = ["Productos", "Servicios", "Locales", "Eventos", "Valoraciones", ...(isOwnProfile ? ["Calendario"] : [])];

  return (
    <div className="profile-page">
      <header className="profile-banner-wrapper">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="Portada" className="banner-image" />
        ) : (
          <div className="banner-placeholder" onClick={() => isOwnProfile && bannerInputRef.current?.click()} style={{ cursor: isOwnProfile ? "pointer" : "default" }}>
            <div className="banner-download-icon">↓</div>
            <p>Agregar imagen de portada</p>
            <small>Recomendado: 3200 x 410 px</small>
          </div>
        )}
        {isOwnProfile && profile.bannerUrl && (
          <button className="banner-change-btn" onClick={() => bannerInputRef.current?.click()}>Cambiar portada</button>
        )}
        <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleBannerChange} />
      </header>

      <div className="avatar-float-wrapper">
        <div className={`avatar-container ${isOwnProfile ? "editable" : ""}`} onClick={() => isOwnProfile && avatarInputRef.current?.click()}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.username} className="avatar-img" />
          ) : (
            <div className="avatar-initials">{profile.username?.charAt(0).toUpperCase() || "U"}</div>
          )}
          {isOwnProfile && <div className="avatar-overlay"><span>Cambiar</span></div>}
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
      </div>

      <div className="profile-layout-container">
        <aside className="profile-sidebar">
          <div className="sidebar-info">
            <h1 className="display-name">{profile.publicName || profile.username}</h1>
            <p className="username">@{profile.username}</p>
            <p className="display-location">{profile.location || "Ubicación no especificada"}</p>
            
            {isOwnProfile && (
              <div className="sidebar-actions">
                <Link to="/edit-profile" className="btn-edit-info">Editar perfil</Link>
              </div>
            )}

            <div className="follow-stats">
              <span className="stat-item"><strong>{followStats.followers}</strong> seguidores</span>
              <span className="stat-item"><strong>{followStats.following}</strong> siguiendo</span>
            </div>

            {!isOwnProfile && user && (
              <button 
                onClick={handleFollow} 
                disabled={followLoading} 
                className={`btn-follow-action ${isFollowing ? "active" : ""}`}
              >
                {followLoading ? "..." : isFollowing ? "Dejar de seguir" : "Seguir"}
              </button>
            )}

            <p className="display-label">Sobre mí</p>
            <p className="display-text">{profile.bio || "Este usuario aún no ha añadido una descripción."}</p>
            
            <p className="display-label">Experiencia</p>
            <p className="display-text">{profile.experience || "Sin experiencia añadida."}</p>
          </div>
        </aside>

        <main className="profile-main">
          <div className="social-header">
            {profile.linkedin && (
              <a href={profile.linkedin} className="social-link" target="_blank" rel="noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
            )}
            {profile.instagram && (
              <a href={profile.instagram} className="social-link" target="_blank" rel="noreferrer">
                <img src={instagramIcon} alt="Instagram" />
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter} className="social-link" target="_blank" rel="noreferrer">
                <img src={twitterIcon} alt="Twitter" />
              </a>
            )}
          </div>

          <nav className="content-tabs">
            {tabs.map((tab) => (
              <button key={tab} className={`tab-item ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {activeTab === "Productos" && renderItemGrid(products, itemsLoading.products, "Productos")}
            {activeTab === "Servicios" && renderItemGrid(services, itemsLoading.services, "Servicios")}
            {activeTab === "Locales" && renderVenues()}
            {activeTab === "Eventos" && renderEvents()}
            {activeTab === "Valoraciones" && <div className="empty-state">Sin valoraciones aún</div>}
            {activeTab === "Calendario" && (
              <div className="calendar-tab">
                {profile.calendarUrl ? (
                  <>
                    <p className="calendar-title">Disponibilidad de {profile.publicName || profile.username}</p>
                    <iframe src={profile.calendarUrl} className="calendar-iframe" title="Google Calendar" />
                  </>
                ) : (
                  <div className="empty-state">
                    {isOwnProfile ? (
                      <>
                        <p>Aún no has vinculado tu calendario.</p>
                        <Link to="/edit-profile" className="btn-edit-info" style={{ marginTop: "12px", width: "auto" }}>Añadir calendario</Link>
                      </>
                    ) : <p>Este usuario no ha vinculado su calendario.</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}