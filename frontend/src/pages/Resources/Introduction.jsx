import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import "./Introduction.css";

const TUTORIALS = [
  {
    id: 1,
    title: "Cómo crear tu primer proyecto",
    description: "Aprende a subir y configurar un proyecto desde cero en ECHO.",
    icon: "📁",
    content: null,
  },
  {
    id: 2,
    title: "Publicar un servicio",
    description: "Guía paso a paso para ofrecer tus servicios en la plataforma.",
    icon: "🛠️",
    content: null,
  },
  {
    id: 3,
    title: "Gestionar encargos",
    description: "Cómo responder, aceptar y completar encargos de clientes.",
    icon: "📋",
    content: null,
  },
  {
    id: 4,
    title: "Personalizar tu perfil",
    description: "Añade bio, avatar, redes sociales y destaca tu trabajo.",
    icon: "✨",
    content: null,
  },
];

export default function Introduction() {
  const [active, setActive] = useState(null);

  const open = (tutorial) => setActive(tutorial);
  const close = () => setActive(null);

  return (
    <>
      <main className="intro-page">
        <section className="intro-hero">
          <div className="intro-hero-inner">
            <span className="intro-hero-tag">Introducción</span>
            <h1 className="intro-hero-title">
              Todo lo que necesitas para<br />
              empezar en <span className="intro-hero-accent">ECHO</span>
            </h1>
            <p className="intro-hero-sub">
              Tutoriales prácticos para artistas, freelancers y creativos que quieren sacar el máximo partido a la plataforma.
            </p>
          </div>
        </section>

        <section className="intro-tutorials">
          <h2 className="intro-section-title">Tutoriales disponibles</h2>
          <div className="intro-grid">
            {TUTORIALS.map((t) => (
              <button key={t.id} className="intro-card" onClick={() => open(t)}>
                <span className="intro-card-icon">{t.icon}</span>
                <h3 className="intro-card-title">{t.title}</h3>
                <p className="intro-card-desc">{t.description}</p>
                <span className="intro-card-cta">Ver tutorial →</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {active && (
        <div className="intro-modal-backdrop" onClick={close}>
          <div className="intro-modal" onClick={(e) => e.stopPropagation()}>
            <button className="intro-modal-close" onClick={close} aria-label="Cerrar">✕</button>
            <span className="intro-modal-icon">{active.icon}</span>
            <h2 className="intro-modal-title">{active.title}</h2>
            <div className="intro-modal-body">
              {active.content ?? (
                <p className="intro-modal-placeholder">Contenido del tutorial próximamente.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

