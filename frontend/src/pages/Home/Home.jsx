import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import ItemsList from "../../components/ItemsList/ItemsList";
import SectionsList from "../../components/SectionsList/SectionsList";
import Footer from "../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSections } from "../../services/sections";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [contentType, setContentType] = useState("proyectos");
  const sortDropdownRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();

  const sortOptions = [
    { value: "recent", label: "Mas recientes" },
    { value: "popular", label: "Mejor valorados" },
    { value: "views", label: "Mas vistos" },
  ];

  const currentSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || "Ordenar";

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="search-bar-integrated">
          <input
            type="text"
            placeholder="Buscar en Echo..."
            className="search-bar-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <nav className="search-type-filters" aria-label="Tipo de contenido">
            {[
              { key: "proyectos", label: "Proyectos" },
              { key: "servicios", label: "Servicios" },
              { key: "locales", label: "Locales" },
              { key: "eventos", label: "Eventos" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`search-type-btn${contentType === key ? " active" : ""}`}
                onClick={() => handleContentType(key)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div
          className={`home-sort-dropdown${isSortOpen ? " open" : ""}`}
          ref={sortDropdownRef}
        >
          <button
            type="button"
            className="home-sort-trigger"
            aria-haspopup="menu"
            aria-expanded={isSortOpen}
            aria-label="Ordenar resultados"
            onClick={() => setIsSortOpen((prev) => !prev)}
          >
            <img src="/filters.svg" alt="" aria-hidden="true" className="home-sort-icon" />
            <span className="home-sort-label">{currentSortLabel}</span>
          </button>
          <div className="home-sort-menu" role="menu" aria-label="Opciones de orden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={sortBy === option.value}
                className={`home-sort-option${sortBy === option.value ? " active" : ""}`}
                onClick={() => {
                  setSortBy(option.value);
                  setIsSortOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {(contentType === "proyectos" || contentType === "servicios") && (
        <div className="home-container-sections">
          <SectionsList onSelect={handleSelect} selectedCategoryId={selectedCategory?.id ?? null} />
        </div>
      )}
      {selectedCategory && (contentType === "proyectos" || contentType === "servicios") && (
        <div className="home-category-title-container">
          <h1 id="top-h1-text-category">{selectedCategory.name}</h1>
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