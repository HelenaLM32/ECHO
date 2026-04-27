import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/events";
import { getVenuesByUser } from "../../services/venues";
import { useAuth } from "../../context/AuthContext";
import "./CreateEvent.css";

export default function CreateEvent() {
 const navigate = useNavigate();
 const { user } = useAuth();
 const [venues, setVenues] = useState([]);
 const [form, setForm] = useState({
 title: "",
 description: "",
 venueId: "",
 startDate: "",
 endDate: "",
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
 if (user?.id) {
 getVenuesByUser(user.id)
 .then(setVenues)
 .catch(() => setVenues([]));
 }
 }, [user]);

 const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!form.title || !form.venueId || !form.startDate || !form.endDate) {
 setError("Titulo, local y fechas son obligatorios");
 return;
 }
 if (new Date(form.startDate) >= new Date(form.endDate)) {
 setError("La fecha de inicio debe ser anterior a la fecha de fin");
 return;
 }
 setLoading(true);
 setError("");
 try {
 await createEvent({
 title: form.title,
 description: form.description,
 venueId: parseInt(form.venueId),
 startDate: form.startDate,
 endDate: form.endDate,
 });
 navigate("/profile");
 } catch (err) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="create-event-page">
 <div className="create-event-container">
 <h1 className="create-event-title">Crear un evento</h1>
 <p className="create-event-subtitle">
 Selecciona un local y define las fechas del evento
 </p>
 
 {error && (
 <div className="create-event-error">{error}</div>
 )}
 
 <form onSubmit={handleSubmit} className="create-event-form">
 <div className="form-group">
 <label>Titulo del evento *</label>
 <input
 type="text"
 name="title"
 value={form.title}
 onChange={handleChange}
 placeholder="Ej: Concierto de jazz"
 maxLength={150}
 />
 </div>
 
 <div className="form-group">
 <label>Local *</label>
 <select
 name="venueId"
 value={form.venueId}
 onChange={handleChange}
 >
 <option value="">Selecciona un local</option>
 {venues.map((v) => (
 <option key={v.id} value={v.id}>
 {v.name} — {v.address}
 </option>
 ))}
 </select>
 {venues.length === 0 && (
 <p className="form-hint">
 No tienes locales registrados.{" "}
 <span
 className="form-link"
 onClick={() => navigate("/venues/create")}
 >
 Crear un local
 </span>
 </p>
 )}
 </div>
 
 <div className="form-group">
 <label>Fecha y hora de inicio *</label>
 <input
 type="datetime-local"
 name="startDate"
 value={form.startDate}
 onChange={handleChange}
 />
 </div>
 
 <div className="form-group">
 <label>Fecha y hora de fin *</label>
 <input
 type="datetime-local"
 name="endDate"
 value={form.endDate}
 onChange={handleChange}
 />
 </div>
 
 <div className="form-group">
 <label>Descripcion</label>
 <textarea
 name="description"
 value={form.description}
 onChange={handleChange}
 placeholder="Describe el evento..."
 rows={4}
 />
 </div>
 
 <div className="form-actions">
 <button
 type="button"
 className="btn-cancel"
 onClick={() => navigate(-1)}
 >
 Cancelar
 </button>
 <button
 type="submit"
 className="btn-submit"
 disabled={loading}
 >
 {loading ? "Creando..." : "Crear evento"}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}