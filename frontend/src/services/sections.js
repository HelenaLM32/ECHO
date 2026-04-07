import { API_URL } from "./config.js";

/**
 * Fetch categories from backend and return minimal shape for SectionsList.
 * Returns array of { id, name }. If any error occurs, returns empty array.
 */
export async function fetchSections() {
    try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) {
            console.error("fetchSections: server responded", res.status);
            return [];
        }
        const data = await res.json();
        // Map backend Category DTO to the minimal shape the UI needs.
        return Array.isArray(data)
            ? data.map((c) => ({ id: c.id, name: c.name }))
            : [];
    } catch (err) {
        console.error("fetchSections error:", err);
        return [];
    }
}
