import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import ItemsList from "../../components/ItemsList/ItemsList";
import SectionsList from "../../components/SectionsList/SectionsList";
import Footer from "../../components/Navigation/Footer/Footer";
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
  const topContainerRef = useRef(null);
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

  useEffect(() => {
    const container = topContainerRef.current;
    if (!container) return;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const offsetX = Math.abs((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      const offsetY = Math.abs((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));

      container.style.setProperty("--parallax-x", `${offsetX * 14}px`);
      container.style.setProperty("--parallax-y", `${offsetY * 5}px`);
    };

    const handleMouseLeave = () => {
      container.style.setProperty("--parallax-x", "0px");
      container.style.setProperty("--parallax-y", "0px");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [selectedCategory]);

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
        <div ref={topContainerRef} className={`home-container-top ${animateIn ? 'animate-in' : ''}`}>
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
            <button 
              type="button"
              className="button-top" 
              onClick={() => navigate('/projects/create')}
            >
              Crear un proyecto
            </button>
            <button 
              type="button"
              className="button-top" 
              onClick={() => navigate('/services/create')}
            >
              Subir un servicio
            </button>
          </div>
        </div>
      )}

      <div className={`home-container-search-section${selectedCategory ? " with-selected-category" : ""}`}>
        <div className="search-bar-integrated">
          <img
            src="/project/ECHOSVGS/magnifying-glass-11-svgrepo-com.svg"
            alt=""
            aria-hidden="true"
            className="search-bar-icon"
          />
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
              { key: "perfiles", label: "Perfiles" },
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
            <svg className="home-sort-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M9 13.829A3.004 3.004 0 0 0 11 11a3.003 3.003 0 0 0-2-2.829V0H7v8.171A3.004 3.004 0 0 0 5 11c0 1.306.836 2.417 2 2.829V16h2v-2.171zm-5-6A3.004 3.004 0 0 0 6 5a3.003 3.003 0 0 0-2-2.829V0H2v2.171A3.004 3.004 0 0 0 0 5c0 1.306.836 2.417 2 2.829V16h2V7.829zm10 0A3.004 3.004 0 0 0 16 5a3.003 3.003 0 0 0-2-2.829V0h-2v2.171A3.004 3.004 0 0 0 10 5c0 1.306.836 2.417 2 2.829V16h2V7.829zM12 6V4h2v2h-2zM2 6V4h2v2H2zm5 6v-2h2v2H7z" fillRule="evenodd"/>
            </svg>
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
