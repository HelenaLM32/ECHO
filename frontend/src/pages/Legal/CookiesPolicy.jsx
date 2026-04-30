import LegalPage from "./LegalPage";

const sections = [
  {
    heading: "1. ¿Qué son las cookies?",
    paragraphs: [
      "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas una web o utilizas una aplicación conectada.",
      "Permiten recordar preferencias, mantener sesiones activas, analizar el uso del servicio y ofrecer funcionalidades personalizadas."
    ]
  },
  {
    heading: "2. Tipos de cookies que utilizamos",
    paragraphs: [
      "En ECHO empleamos cookies propias y, en algunos casos, de terceros, con finalidades técnicas, analíticas y de personalización.",
      "Las categorías pueden variar según el entorno y las integraciones activas en cada momento."
    ],
    items: [
      "Cookies técnicas: necesarias para el funcionamiento básico, autenticación y seguridad.",
      "Cookies de preferencias: recuerdan idioma, sesión y configuraciones elegidas.",
      "Cookies analíticas: ayudan a medir tráfico, rendimiento y comportamiento agregado.",
      "Cookies de terceros: pueden habilitar servicios externos como contenido embebido o métricas complementarias."
    ]
  },
  {
    heading: "3. Base legal y consentimiento",
    paragraphs: [
      "Las cookies estrictamente necesarias se utilizan por interés legítimo para garantizar la prestación del servicio.",
      "Las cookies no esenciales se activan únicamente cuando existe consentimiento válido, que puede retirarse en cualquier momento."
    ]
  },
  {
    heading: "4. Gestión de cookies",
    paragraphs: [
      "Puedes aceptar, rechazar o configurar cookies no esenciales desde el panel de preferencias disponible en la plataforma cuando corresponda.",
      "Además, la mayoría de navegadores permiten bloquear o eliminar cookies desde su configuración de privacidad."
    ]
  },
  {
    heading: "5. Plazos de conservación",
    paragraphs: [
      "Algunas cookies se eliminan al cerrar la sesión del navegador y otras permanecen durante un período definido para recordar ajustes y mejorar el servicio.",
      "Los plazos concretos pueden actualizarse en función de requisitos técnicos, contractuales o legales."
    ]
  },
  {
    heading: "6. Cambios en esta política",
    paragraphs: [
      "Podemos modificar esta Política de Cookies para adaptarla a nuevas tecnologías, normativas o funcionalidades.",
      "La versión actualizada se publicará en esta página con la fecha de revisión correspondiente."
    ]
  }
];

export default function CookiesPolicy() {
  return (
    <LegalPage
      title="Política de Cookies"
      lastUpdated="30 de abril de 2026"
      intro="Esta Política de Cookies explica cómo ECHO utiliza cookies y tecnologías similares para reconocer tu dispositivo, mejorar la experiencia de navegación y obtener información estadística sobre el uso de la plataforma."
      sections={sections}
    />
  );
}
