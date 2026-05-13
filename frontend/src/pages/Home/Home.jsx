import React, { useState, useEffect } from "react";
import "./Home.css";
import ItemsList from "../../components/ItemsList/ItemsList";
import SectionsList from "../../components/SectionsList/SectionsList";
import Footer from "../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSections } from "../../services/sections";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [sections, setSections] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [contentType, setContentType] = useState("proyectos");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchSections();
        if (mounted) setSections(data || []);
      } catch (e) {
        // Error silenciado
      }
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    const slug = params.slug;
    if (!slug) {
      setSelectedCategory(null);
      return;
    }
    const found = sections.find((c) => c.slug === slug || String(c.id) === slug);
    setSelectedCategory(found || null);
  }, [params.slug, sections]);

  //Animacion de entrada del texto
  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Handler de las categorias
  const handleSelect = (section) => {
    if (!section) {
      setSelectedCategory(null);
      navigate("/");
      return;
    }
    setSelectedCategory(section);
    if (section.slug) {
      navigate(`/category/${section.slug}`);
    }
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    navigate("/");
  };

  const handleContentType = (type) => {
    setContentType(type);
    setSearchQuery("");
    if (type === "locales" || type === "eventos" || type === "perfiles") {
      setSelectedCategory(null);
      navigate("/");
    }
  };



  return (
    <div className="home-container">

      {/* Si no hay categoria seleccionada */}
      {!selectedCategory && (
        <div className={`home-container-top ${animateIn ? 'animate-in' : ''}`}>
          {/* decorative blobs (8 total) */}
          <div className="decor-blob deco-1" aria-hidden="true" />
          <div className="decor-blob deco-2" aria-hidden="true" />
          <div className="decor-blob deco-3" aria-hidden="true" />
          <div className="decor-blob deco-4" aria-hidden="true" />
          <div className="decor-blob deco-5" aria-hidden="true" />
          <div className="decor-blob deco-6" aria-hidden="true" />
          <div className="decor-blob deco-7" aria-hidden="true" />
          <div className="decor-blob deco-8" aria-hidden="true" />
          <div id="home-container-top-text">
            <h1 id="top-h1-text">DESCUBRE A LOS MEJORES ARTISTAS EN <span id="texto-h1-echo">ECHO</span></h1>
            <h3 id="top-h3-text">Explora el trabajo de nuestros talentosos artistas, inspirate y conecta con ellos subiendo proyectos o contratando servicios</h3>
          </div>
          <div id="home-container-top-buttons">
            <div className="button-top" onClick={() => navigate('/proyect')}>
              Crear un proyecto
            </div>
            <div className="button-top" onClick={() => navigate('/profile/services/new')}>
              Subir un servicio
            </div>
          </div>
        </div>
      )}

      <div className="home-container-search-section">
        <input
          type="text"
          placeholder="Buscar en Echo..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-button"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Ordenar proyectos"
        >
          <option value="recent">Mas recientes</option>
          <option value="popular">Mas populares</option>
          <option value="views">Mas vistos</option>
        </select>
      </div>
      <nav className="home-content-type-nav" aria-label="Tipo de contenido">
        {[
          { key: "proyectos", label: "Proyectos" },
          { key: "servicios", label: "Servicios" },
          { key: "locales", label: "Locales" },
          { key: "eventos", label: "Eventos" },
          { key: "perfiles", label: "Perfiles" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`home-content-type-btn${contentType === key ? " active" : ""}`}
            onClick={() => handleContentType(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      {(contentType === "proyectos" || contentType === "servicios") && (
        <div className="home-container-sections">
          <SectionsList onSelect={handleSelect} selectedCategoryId={selectedCategory?.id ?? null} />
        </div>
      )}
      {selectedCategory && (contentType === "proyectos" || contentType === "servicios") && (
        <div className="home-category-title-container">
          <h1 id="top-h1-text-category">{selectedCategory.name}</h1>
          <button type="button" className="button-selected-category" onClick={clearCategoryFilter}>
            Quitar filtro
          </button>
        </div>
      )}
      <div className="home-container-item-section">
        <ItemsList
          searchQuery={searchQuery}
          selectedCategoryId={selectedCategory?.id ?? null}
          sortBy={sortBy}
          contentType={contentType}
        />

      </div>

      <Footer />
    </div>
  );
}