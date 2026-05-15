import Footer from "../../components/Navigation/Footer/Footer";
import "./AboutUs.css";

const SECTIONS = [
  {
    id: 1,
    title: "Quiénes somos",
    text: "Somos estudiantes de 2º de DAW en CEFP Nuria de Gavà y creamos ECHO como proyecto con propósito real. Nos une la pasión por el arte, la cultura indie y la tecnología aplicada a problemas cotidianos. Desde el principio tuvimos claro que no queríamos construir solo una app para entregar en clase, sino una plataforma útil para la gente creativa que intenta vivir de su trabajo.",
    img: null,
    imgAlt: "El equipo de ECHO",
    placeholder: "Foto del equipo",
  },
  {
    id: 2,
    title: "Qué nos inspiró",
    text: "Nos inspiró ver la falta de recursos que todavía existe en el mercado más físico: artistas, artesanos y perfiles creativos con mucho talento, pero sin visibilidad digital, sin herramientas para presentar su trabajo y con dificultades para encontrar clientes estables. ECHO nace para acortar esa distancia entre talento y oportunidad.",
    img: null,
    imgAlt: "Inspiración de ECHO",
    placeholder: "Foto inspiración",
  },
  {
    id: 3,
    title: "Qué queremos aportar",
    text: "Queremos que cualquier persona creativa pueda tener un escaparate claro y profesional, enseñar su estilo, publicar servicios y conectar con clientes de forma más directa. Apostamos por una experiencia cercana, sencilla y honesta, donde el foco esté en el trabajo bien hecho y en la identidad propia de cada creador, no en algoritmos opacos.",
    img: null,
    imgAlt: "Aportación de ECHO",
    placeholder: "Foto plataforma",
  },
  {
    id: 4,
    title: "Hacia dónde vamos",
    text: "Nuestro objetivo es seguir evolucionando ECHO para que se convierta en un punto de referencia para la escena creativa independiente. Queremos incluir más recursos formativos, mejores herramientas para gestionar encargos y funciones que faciliten que los proyectos salten de lo local a nuevas oportunidades. Este proyecto empieza en el aula, pero está pensado para crecer fuera de ella.",
    img: null,
    imgAlt: "Futuro de ECHO",
    placeholder: "Foto futuro",
  },
];

export default function AboutUs() {
  return (
    <>
      <main className="about-page">

        <section className="about-hero">
          <div className="about-hero-inner">
            <span className="about-hero-tag">Sobre nosotros</span>
            <h1 className="about-hero-title">
              La plataforma hecha<br />
              por y para <span className="about-hero-accent">creadores</span>
            </h1>
            <p className="about-hero-sub">
              Nacimos en 2º de DAW en CEFP Nuria de Gavà con una idea clara: dar más visibilidad al talento artístico e indie y facilitar que los perfiles creativos encuentren clientes reales.
            </p>
            <div className="about-hero-pills" aria-label="Datos del proyecto ECHO">
              <span className="about-hero-pill">2º DAW</span>
              <span className="about-hero-pill">CEFP Nuria de Gavà</span>
              <span className="about-hero-pill">Pasión por el arte e indie</span>
              <span className="about-hero-pill">Impacto en el mercado local</span>
            </div>
          </div>
        </section>

        <div className="about-sections">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              className={`about-row ${i % 2 === 1 ? "about-row--reverse" : ""}`}
            >
              <div className="about-row-text">
                <h2 className="about-row-title">{s.title}</h2>
                <p className="about-row-body">{s.text}</p>
              </div>
              <div className="about-row-media">
                {s.img
                  ? <img src={s.img} alt={s.imgAlt} className="about-row-img" />
                  : (
                    <div className="about-row-placeholder" role="img" aria-label={s.imgAlt}>
                      <span>{s.placeholder}</span>
                    </div>
                  )
                }
              </div>
            </section>
          ))}
        </div>

      </main>
      <Footer />
    </>
  );
}

