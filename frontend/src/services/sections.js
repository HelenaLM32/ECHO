import { API_URL } from "./config.js";

export async function fetchSections() {
    // Cuando el backend esté listo, reemplazar este mock por:
    // const res = await fetch(`${API_URL}/sections`);
    // if (!res.ok) throw new Error('Error al obtener secciones');
    // return await res.json();

    // Mock inicial para desarrollo local
    return [
        { id: "for-you", name: "Para ti" },
        { id: "following", name: "Siguiendo" },
        { id: "best-of-echo", name: "Lo mejor de ECHO" },
        { id: "graphic-design", name: "Diseño Gráfico" },
        { id: "photography", name: "Fotografía" },
        { id: "illustration", name: "Ilustración" },
        { id: "3d-art", name: "Arte 3D" },
        { id: "architecture", name: "Arquitectura" },
        { id: "fashion", name: "Moda" },

    ];
}
