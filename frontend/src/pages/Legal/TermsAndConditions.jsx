import LegalPage from "./LegalPage";

const sections = [
  {
    heading: "1. Objeto y aceptación",
    paragraphs: [
      "Estos Términos y Condiciones regulan el acceso y uso de ECHO, incluyendo sus funcionalidades para creadores, clientes y personas visitantes.",
      "El uso de la plataforma implica la aceptación expresa de estos términos. Si no estás de acuerdo, debes abstenerte de utilizar el servicio."
    ]
  },
  {
    heading: "2. Condiciones de acceso",
    paragraphs: [
      "Para utilizar determinadas funcionalidades es necesario crear una cuenta y proporcionar información veraz, actualizada y completa.",
      "La persona usuaria es responsable de mantener la confidencialidad de sus credenciales y de toda actividad realizada desde su cuenta."
    ]
  },
  {
    heading: "3. Uso permitido y prohibiciones",
    paragraphs: [
      "El uso de ECHO debe realizarse conforme a la ley, la buena fe y el respeto a terceros.",
      "No está permitido publicar o distribuir contenido ilícito, engañoso, difamatorio, fraudulento o que infrinja derechos de propiedad intelectual o industrial."
    ],
    items: [
      "No manipular sistemas, APIs, seguridad o disponibilidad del servicio.",
      "No suplantar identidades ni utilizar cuentas de terceros sin autorización.",
      "No usar la plataforma para fines de spam, scraping no autorizado o actividades abusivas."
    ]
  },
  {
    heading: "4. Contenidos y propiedad intelectual",
    paragraphs: [
      "Cada persona usuaria conserva los derechos sobre los contenidos que publique y garantiza disponer de legitimidad para hacerlo.",
      "Al publicar contenido en ECHO, se concede una licencia no exclusiva, mundial y limitada al funcionamiento del servicio para alojar, mostrar y comunicar dicho contenido dentro de la plataforma."
    ]
  },
  {
    heading: "5. Contrataciones y transacciones",
    paragraphs: [
      "ECHO facilita la conexión entre partes, pero cada operación concreta se rige por las condiciones pactadas entre quienes contratan, además de las políticas internas aplicables.",
      "Las partes asumen la responsabilidad sobre la veracidad de la información comercial, los plazos, la calidad de la entrega y el cumplimiento de sus obligaciones legales y fiscales."
    ]
  },
  {
    heading: "6. Suspensión o cancelación de cuentas",
    paragraphs: [
      "Podremos suspender o cancelar cuentas cuando exista incumplimiento de estos términos, riesgo de seguridad, requerimiento legal o conducta que perjudique a la comunidad.",
      "Cuando sea posible, se notificará a la persona afectada y se indicarán las medidas para subsanar la situación."
    ]
  },
  {
    heading: "7. Limitación de responsabilidad",
    paragraphs: [
      "ECHO presta sus servicios con diligencia razonable, pero no garantiza disponibilidad continua, ausencia total de errores o resultados comerciales específicos.",
      "En la medida permitida por la ley, no seremos responsables por daños indirectos, lucro cesante o pérdidas derivadas del uso o imposibilidad de uso del servicio."
    ]
  },
  {
    heading: "8. Modificaciones y ley aplicable",
    paragraphs: [
      "Podemos actualizar estos términos para adaptarlos a cambios normativos o funcionales. Las modificaciones se publicarán con antelación razonable cuando corresponda.",
      "Estos términos se interpretan conforme a la legislación aplicable del lugar de operación de ECHO, sin perjuicio de los derechos imperativos de consumidores."
    ]
  }
];

export default function TermsAndConditions() {
  return (
    <LegalPage
      title="Términos y Condiciones"
      lastUpdated="30 de abril de 2026"
      intro="Este documento establece las reglas de uso de la plataforma ECHO y los compromisos básicos entre la plataforma y sus personas usuarias. Te recomendamos leerlo con atención antes de registrarte o contratar servicios."
      sections={sections}
    />
  );
}
