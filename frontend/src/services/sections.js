import { API_URL } from "./config.js";


export async function fetchSections() {
    try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) {
            console.error("fetchSections: server responded", res.status);
            return [];
        }
        const data = await res.json();

        return Array.isArray(data)
            ? data.map((c) => ({ id: c.id, name: c.name }))
            : [];
    } catch (err) {
        console.error("fetchSections error:", err);
        return [];
    }
}
