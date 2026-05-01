import LegalPage from "./LegalPage";

const sections = [
  {
    heading: "1. Responsable del tratamiento",
    paragraphs: [
      "ECHO actúa como responsable del tratamiento de los datos personales recabados a través de su sitio web, su aplicación y sus canales asociados.",
      "Tratamos la información de forma lícita, leal y transparente, aplicando medidas técnicas y organizativas apropiadas para garantizar su seguridad."
    ]
  },
  {
    heading: "2. Datos que recopilamos",
    paragraphs: [
      "Podemos recopilar datos identificativos, de contacto, de autenticación, de actividad en la plataforma y, cuando corresponda, datos de facturación y soporte.",
      "También se registran datos técnicos necesarios para el funcionamiento del servicio, como dirección IP, tipo de dispositivo, navegador, idioma y eventos de navegación."
    ],
    items: [
      "Datos facilitados por el usuario al registrarse o editar su perfil.",
      "Información generada por la interacción con proyectos, pedidos, valoraciones y mensajes.",
      "Datos obtenidos mediante cookies y tecnologías similares según las preferencias del usuario."
    ]
  },
  {
    heading: "3. Finalidades y base jurídica",
    paragraphs: [
      "Utilizamos los datos para prestar el servicio, gestionar cuentas, mantener la seguridad de la plataforma, atender consultas, prevenir fraudes y mejorar la experiencia de uso.",
      "La base jurídica puede ser la ejecución de un contrato, el cumplimiento de obligaciones legales, el consentimiento del usuario o el interés legítimo debidamente ponderado."
    ]
  },
  {
    heading: "4. Conservación de la información",
    paragraphs: [
      "Conservamos los datos durante el tiempo necesario para cumplir las finalidades indicadas y los plazos legales aplicables.",
      "Cuando los datos dejan de ser necesarios, se eliminan o se anonimizan de forma segura."
    ]
  },
  {
    heading: "5. Destinatarios y transferencias",
    paragraphs: [
      "Podemos compartir información con proveedores tecnológicos y colaboradores que actúan como encargados del tratamiento, siempre bajo acuerdos de confidencialidad y seguridad.",
      "No realizamos ventas de datos personales. Si se produjeran transferencias internacionales, se aplicarán las garantías exigidas por la normativa vigente."
    ]
  },
  {
    heading: "6. Derechos de las personas usuarias",
    paragraphs: [
      "Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos.",
      "También tienes derecho a retirar tu consentimiento en cualquier momento cuando el tratamiento se base en él, sin afectar la licitud del tratamiento previo."
    ]
  },
  {
    heading: "7. Seguridad",
    paragraphs: [
      "Aplicamos medidas de seguridad razonables para proteger la información frente a accesos no autorizados, pérdida, alteración o divulgación indebida.",
      "Aun así, ningún sistema es completamente infalible, por lo que recomendamos utilizar contraseñas robustas y mantener credenciales bajo control."
    ]
  },
  {
    heading: "8. Cambios en esta política",
    paragraphs: [
      "Podemos actualizar esta política para reflejar cambios legales, técnicos o de negocio.",
      "Publicaremos la versión vigente en esta misma sección e indicaremos la fecha de última actualización."
    ]
  }
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Política de Privacidad"
      lastUpdated="30 de abril de 2026"
      intro="Esta Política de Privacidad describe cómo ECHO recopila, utiliza, protege y comparte la información personal de las personas usuarias. Al utilizar nuestros servicios, aceptas las prácticas aquí descritas en la medida en que sean aplicables."
      sections={sections}
    />
  );
}
