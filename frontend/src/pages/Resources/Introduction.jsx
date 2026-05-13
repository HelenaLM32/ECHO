import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import "./Introduction.css";

const TUTORIALS = [
  {
    id: 1,
    title: "Cómo crear tu primer proyecto",
    description: "Prepara tu ficha, sube imágenes y publica tu proyecto paso a paso.",
    img: "/images/project.jpg",
    imgAlt: "Tutorial para crear tu primer proyecto en ECHO",
    content: (
      <>
        <p>
          Este tutorial te guía para publicar un proyecto completo y profesional desde cero.
        </p>
        <h3>Paso a paso</h3>
        <ol>
          <li>Ve a tu perfil y entra en la sección de proyectos.</li>
          <li>Haz clic en "Crear proyecto".</li>
          <li>Añade título claro, categoría y una descripción breve del trabajo.</li>
          <li>Sube portada y galería con imágenes de buena calidad.</li>
          <li>Completa herramientas, estilo, tiempos estimados y presupuesto orientativo.</li>
          <li>Revisa toda la información y publica.</li>
        </ol>
        <p>
          Consejo: usa una portada limpia y una descripción en primera persona para generar confianza.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "Cómo trabajar en local",
    description: "Organiza tu proyecto en local para editar, revisar y mantener versiones.",
    img: "/images/venue.jpg",
    imgAlt: "Tutorial sobre espacios y trabajo en local en ECHO",
    content: (
      <>
        <p>
          Configura un flujo básico en local para trabajar con orden antes de publicar cambios.
        </p>
        <h3>Checklist recomendado</h3>
        <ol>
          <li>Crea una carpeta principal por cliente o proyecto.</li>
          <li>Organiza subcarpetas: referencias, entregables y versiones.</li>
          <li>Guarda una versión inicial y usa nombres consistentes para los archivos.</li>
          <li>Antes de cada entrega, exporta una versión final con fecha.</li>
          <li>Sube a ECHO solo archivos finales y añade contexto en la descripción.</li>
        </ol>
        <p>
          Consejo: mantener orden en local reduce errores y agiliza revisiones con clientes.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: "Publicar un servicio",
    description: "Define alcance, plazos y precio para que te contacten clientes adecuados.",
    img: "/images/service.jpg",
    imgAlt: "Tutorial para publicar un servicio en ECHO",
    content: (
      <>
        <p>
          Un servicio bien definido mejora la calidad de los contactos y evita malentendidos.
        </p>
        <h3>Puntos clave</h3>
        <ol>
          <li>Escribe un título directo y orientado a resultado.</li>
          <li>Explica qué incluye exactamente y qué no incluye.</li>
          <li>Marca tiempos de entrega realistas y número de revisiones.</li>
          <li>Define precio base y extras opcionales.</li>
          <li>Publica ejemplos visuales para reforzar tu propuesta.</li>
        </ol>
        <p>
          Consejo: si tu oferta es específica, atraerás encargos más alineados con tu perfil.
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: "Gestionar encargos y entregas",
    description: "Responde mensajes, confirma hitos y entrega de forma profesional.",
    img: "/images/orders.jpg",
    imgAlt: "Tutorial para gestionar encargos y entregas en ECHO",
    content: (
      <>
        <p>
          Este flujo te ayuda a mantener una comunicación clara desde el primer contacto hasta el cierre.
        </p>
        <h3>Flujo sugerido</h3>
        <ol>
          <li>Responde con un resumen de alcance, precio y fecha estimada.</li>
          <li>Confirma por escrito entregables y formato final.</li>
          <li>Actualiza avances en puntos concretos del proceso.</li>
          <li>Entrega con una nota breve explicando qué se incluye.</li>
          <li>Solicita feedback final y cierra el encargo.</li>
        </ol>
        <p>
          Consejo: la claridad en cada paso mejora valoraciones y repetición de clientes.
        </p>
      </>
    ),
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
                <div className="intro-card-media" aria-hidden="true">
                  <img src={t.img} alt={t.imgAlt} className="intro-card-image" />
                </div>
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
            <div className="intro-modal-media" aria-hidden="true">
              <img src={active.img} alt={active.imgAlt} className="intro-modal-image" />
            </div>
            <h2 className="intro-modal-title">{active.title}</h2>
            <div className="intro-modal-body">
              {active.content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

