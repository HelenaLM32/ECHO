import { fetchApi } from "./config.js";


export async function fetchSections() {
    try {
        const res = await fetchApi('/categories');
        if (!res.ok) {
            return [];
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return [];
        }
        const data = await res.json();

        return Array.isArray(data)
            ? data
                .filter((c) => c && c.id != null && c.name)
                .filter((c) => c.isActive !== false)
                .map((c) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    description: c.description || "",
                    iconUrl: c.iconUrl || "",
                }))
            : [];
    } catch (err) {
        return [];
    }
}
