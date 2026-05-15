import { Link } from "react-router-dom";
import Footer from "../../components/Navigation/Footer/Footer";
import "./LegalPage.css";

export default function LegalPage({ title, lastUpdated, intro, sections }) {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <p className="legal-eyebrow">ECHO · Información legal</p>
          <h1>{title}</h1>
          <p className="legal-updated">Última actualización: {lastUpdated}</p>
        </div>
      </div>

      <main className="legal-main">
        <article className="legal-article" aria-label={title}>
          <p className="legal-intro">{intro}</p>

          {sections.map((section, index) => (
            <section key={section.heading} className="legal-section" aria-labelledby={`legal-section-${index}`}>
              <h2 id={`legal-section-${index}`}>{section.heading}</h2>
              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p key={`${section.heading}-paragraph-${paragraphIndex}`}>{paragraph}</p>
              ))}
              {section.items?.length > 0 && (
                <ul>
                  {section.items.map((item, itemIndex) => (
                    <li key={`${section.heading}-item-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="legal-section legal-contact" aria-labelledby="legal-contact-heading">
            <h2 id="legal-contact-heading">Contacto</h2>
            <p>
              Si tienes dudas sobre este documento o sobre el tratamiento de tus datos, puedes escribirnos a
              {" "}
              <a href="mailto:echo.info.contact@gmail.com">echo.info.contact@gmail.com</a>.
            </p>
            <p>
              También puedes volver a la página principal desde
              {" "}
              <Link to="/">inicio</Link>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
