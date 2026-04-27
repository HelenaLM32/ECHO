import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../../services/venues";
import Navbar from "../../components/Navbar/Navbar";
import "./CreateVenue.css";

export default function CreateVenue() {
 const navigate = useNavigate();
 const [form, setForm] = useState({
 name: "",
 address: "",
 capacity: "",
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!form.name || !form.address) {
 setError("Nombre y direccion son obligatorios");
 return;
 }
 setLoading(true);
 setError("");
 try {
 await createVenue({
 name: form.name,
 address: form.address,
 capacity: form.capacity ? parseInt(form.capacity) : null,
 });
 navigate("/profile");
 } catch (err) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="create-venue-page">
 <div className="create-venue-container">
 <h1 className="create-venue-title">Crear un local</h1>
 <p className="create-venue-subtitle">
 Registra tu espacio para poder asociarle eventos
 </p>
 
 {error && <div className="create-venue-error">{error}</div>}
 
 <form onSubmit={handleSubmit} className="create-venue-form">
 <div className="form-group">
 <label>Nombre del local *</label>
 <input
 type="text"
 name="name"
 value={form.name}
 onChange={handleChange}
 placeholder="Ej: Sala Apolo"
 maxLength={150}
 />
 </div>
 
 <div className="form-group">
 <label>Direccion *</label>
 <input
 type="text"
 name="address"
 value={form.address}
 onChange={handleChange}
 placeholder="Ej: Carrer de la Rambla 113, Barcelona"
 maxLength={255}
 />
 </div>
 
 <div className="form-group">
 <label>Capacidad</label>
 <input
 type="number"
 name="capacity"
 value={form.capacity}
 onChange={handleChange}
 placeholder="Ej: 500"
 min={1}
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
 {loading ? "Creando..." : "Crear local"}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}