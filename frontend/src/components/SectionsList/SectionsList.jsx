import React, { useState, useEffect } from "react";
import "./SectionsList.css";
import { fetchSections } from "../../services/sections";

function SectionsList({ onSelect }) {
	const [sections, setSections] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				const data = await fetchSections();
				if (mounted) setSections(data);
			} catch (e) {
				console.error("Error cargando secciones", e);
			} finally {
				if (mounted) setLoading(false);
			}
		};
		load();
		return () => (mounted = false);
	}, []);

	if (loading) return <div className="sections-loading">Cargando secciones...</div>;
	if (!sections.length) return null;

	const handleSelect = (section) => {
		if (onSelect) onSelect(section);
		else console.log("Sección seleccionada:", section);
	};

	return (
		<ul className="sections-container" role="list">
			{sections.map((s) => (
				<div key={s.id} className="section-item">
					<button
						type="button"
						className="section-card"
						aria-label={`Ir a sección ${s.name}`}
						onClick={() => handleSelect(s)}
					>
						<span className="section-title">{s.name}</span>
					</button>
				</div>
			))}
		</ul>
	);
}

export default SectionsList;

