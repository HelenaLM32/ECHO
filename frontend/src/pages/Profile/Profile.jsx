import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfileByUserId, updateAvatar, updateBanner, getProfileProducts, getProfileServices } from "../../services/profile";
import linkedinIcon from '../../assets/icons8-linkedin-24.png';
import twitterIcon from '../../assets/icons8-x-24.png';
import instagramIcon from '../../assets/icons8-instagram-24.png';
import Footer from "../../components/Footer/Footer";
import "./Profile.css";

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

  // Cargar perfil base
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

  // Cargar items cuando cambia el tab
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
              <p className="item-type">{item.itemType}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loadingContext || loading) return <div className="profile-page">Cargando perfil...</div>;
  if (error || !profile) return <div className="profile-page">{error || "Perfil no encontrado"}</div>;

  const tabs = ["Productos", "Servicios"];

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

          <div className="tab-content">
            {activeTab === "Productos" && renderItemGrid(products, itemsLoading.products)}
            {activeTab === "Servicios" && renderItemGrid(services, itemsLoading.services)}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}