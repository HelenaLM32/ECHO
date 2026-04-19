import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfileByUserId, updateAvatar, updateBanner, getProfileProducts, getProfileServices } from "../../services/profile";
import { getReviewsByUser, getAverageByUser } from "../../services/reviews";
import ReviewsModal from "../../components/ReviewsModal/ReviewsModal";
import linkedinIcon from '../../assets/icons8-linkedin-24.png';
import twitterIcon from '../../assets/icons8-x-24.png';
import instagramIcon from '../../assets/icons8-instagram-24.png';
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
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const targetId = userId ? parseInt(userId) : user?.id;
  const isOwnProfile = !userId || parseInt(userId) === user?.id;

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState({
    products: false,
    services: false
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Productos");

  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [reviewStats, setReviewStats]   = useState({ average: null, count: 0 });
  const [reviews, setReviews]           = useState([]);
  const [showReviews, setShowReviews]   = useState(false);

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

    if (activeTab === "Productos") {
      setItemsLoading(prev => ({ ...prev, products: true }));
      getProfileProducts(targetId)
        .then((data) => setProducts(data))
        .catch(() => setProducts([]))
        .finally(() => setItemsLoading(prev => ({ ...prev, products: false })));
    }
    else if (activeTab === "Servicios") {
      setItemsLoading(prev => ({ ...prev, services: true }));
      getProfileServices(targetId)
        .then((data) => setServices(data))
        .catch(() => setServices([]))
        .finally(() => setItemsLoading(prev => ({ ...prev, services: false })));
    }
  }, [activeTab, targetId, profile]);

  useEffect(() => {
    if (!targetId) return;

    getFollowStats(targetId)
      .then(setFollowStats)
      .catch(() => {});

    if (user && !isOwnProfile) {
      checkIsFollowing(targetId)
        .then((data) => setIsFollowing(data.following))
        .catch(() => {});
    }
  }, [targetId, user, isOwnProfile]);

  useEffect(() => {
    if (!targetId) return;
    getAverageByUser(targetId)
      .then((data) => setReviewStats({ average: data.average, count: data.count ?? 0 }))
      .catch(() => {});
  }, [targetId]);

  const handleOpenReviews = () => {
    getReviewsByUser(targetId)
      .then((data) => { setReviews(data); setShowReviews(true); })
      .catch(() => setShowReviews(true));
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const updated = await updateBanner(user.id, file);
      setProfile(updated);
    } catch {
      alert("Error al guardar la portada");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const updated = await updateAvatar(user.id, file);
      setProfile(updated);
    } catch {
      alert("Error al guardar el avatar");
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetId);
        setIsFollowing(false);
        setFollowStats((prev) => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await followUser(targetId);
        setIsFollowing(true);
        setFollowStats((prev) => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  const renderItemGrid = (items, isLoading) => {
    if (isLoading) {
      return <div className="empty-state">Cargando...</div>;
    }

    if (!items || items.length === 0) {
      return <div className="empty-state">No hay elementos disponibles</div>;
    }

    return (
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-image-placeholder">
              📦
            </div>
            <div className="item-info">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-price">${item.basePrice}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loadingContext || loading) return <div className="profile-page">Cargando perfil...</div>;
  if (error || !profile) return <div className="profile-page">{error || "Perfil no encontrado"}</div>;

 const tabs = ["Productos", "Servicios", "Eventos", "Valoraciones", ...(isOwnProfile ? ["Calendario"] : [])];

  return (
    <>
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
            <div className="banner-download-icon">↓</div>
            <p>Agregar imagen de portada</p>
            <small>Recomendado: 3200 x 410 px</small>
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
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.username} className="avatar-img" />
          ) : (
            <div className="avatar-initials">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
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
            <h1 className="display-name">
              {profile.publicName || profile.username}
            </h1>

            <p className="username">@{profile.username}</p>

            <p className="display-location">
              {profile.location || "Ubicación no especificada"}
            </p>

            <button
              className="profile-rating-badge"
              onClick={handleOpenReviews}
              title="Ver valoraciones"
            >
              <span className="profile-rating-star">★</span>
              <span className="profile-rating-avg">
                {reviewStats.average != null ? reviewStats.average.toFixed(1) : "—"}
              </span>
              <span className="profile-rating-count">({reviewStats.count})</span>
            </button>

            {isOwnProfile && (
              <div className="sidebar-actions">
                <Link to="/edit-profile" className="btn-edit-info">
                  Editar perfil
                </Link>
              </div>
            )}

            <p className="display">Sobre mí</p>
            <p className="display-bio">
              {profile.bio || "Este usuario aún no ha añadido una descripción."}
            </p>

            <p className="display">Experiencia</p>
            <p className="display-experience">
              {profile.experience || "Sin experiencia añadida."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "24px", margin: "8px 0" }}>
            <span style={{ fontWeight: "bold" }}>
              {followStats.followers}{" "}
              <span style={{ fontWeight: "normal" }}>seguidores</span>
            </span>
            <span style={{ fontWeight: "bold" }}>
              {followStats.following}{" "}
              <span style={{ fontWeight: "normal" }}>siguiendo</span>
            </span>
          </div>

          {!isOwnProfile && user && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={isFollowing ? "btn-unfollow" : "btn-follow"}
              style={{
                padding: "8px 24px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                background: isFollowing ? "#e0e0e0" : "var(--color-primary, #7c3aed)",
                color: isFollowing ? "#333" : "#fff",
                marginBottom: "12px",
              }}
            >
              {followLoading ? "..." : isFollowing ? "Dejar de seguir" : "Seguir"}
            </button>
          )}
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
              <button
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

{isOwnProfile && activeTab === "Proyectos" && (
  <div className="project-editor-action">
    <Link to="/itemproyect" className="project-card-button">
      <span className="project-card-icon">+</span>
      <span className="project-card-label">Crear nuevo proyecto</span>
    </Link>
  </div>
)}

<nav className="content-tabs secondary-tabs">
  {tabs2.map((tab) => (
    <button
      key={tab}
      className={`tab-item ${activeTab === tab ? "active" : ""}`}
      onClick={() => setActiveTab(tab)}
    >
      {tab}
    </button>
  ))}
</nav>
        </main>
      </div>
      <Footer />
    </div>

    {showReviews && (
      <ReviewsModal
        reviews={reviews}
        average={reviewStats.average}
        count={reviewStats.count}
        onClose={() => setShowReviews(false)}
      />
    )}
    </>
  );
}


