import Footer from "../../components/Footer/Footer";
import "./AboutUs.css";

const SECTIONS = [
  {
    id: 1,
    title: "Quiénes somos",
    text: "ECHO nació con la idea de conectar artistas, músicos, diseñadores y creativos con personas que buscan talento auténtico. Somos un equipo apasionado por la cultura y la tecnología.",
    img: null,
    imgAlt: "El equipo de ECHO",
  },
  {
    id: 2,
    title: "Nuestra misión",
    text: "Queremos que cada artista tenga un escaparate profesional donde mostrar su trabajo, gestionar encargos y crecer como profesional, sin barreras.",
    img: null,
    imgAlt: "Misión de ECHO",
  },
  {
    id: 3,
    title: "Nuestra visión",
    text: "Construir la comunidad creativa de referencia en habla hispana: un lugar donde el talento se reconoce, se contrata y se celebra.",
    img: null,
    imgAlt: "Visión de ECHO",
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
              Conoce la historia, el equipo y los valores que hay detrás de ECHO.
            </p>
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
                  : <div className="about-row-placeholder"><span>📷</span></div>
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

