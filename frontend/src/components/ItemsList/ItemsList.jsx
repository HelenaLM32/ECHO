import React, { useState, useEffect } from "react";
import ItemProduct from "../ItemProduct/ItemProduct.jsx";
import { API_URL } from "../../services/config.js";
import "./ItemsList.css";

const MOCK_ITEMS = [
  { id: 1, creatorId: 10, title: "Diseño de logo", description: "Creación de logo profesional", basePrice: 150.0, itemType: "Diseño" },
  { id: 2, creatorId: 11, title: "Fotografía de producto", description: "Sesión fotográfica para e-commerce", basePrice: 200.0, itemType: "Fotografía" },
  { id: 3, creatorId: 12, title: "Ilustración digital", description: "Ilustración personalizada en estilo cartoon", basePrice: 80.0, itemType: "Ilustración" },
  { id: 4, creatorId: 13, title: "Diseño de interfaz", description: "Diseño de interfaz para aplicación móvil", basePrice: 300.0, itemType: "Diseño" },
  //segunda row
    { id: 5, creatorId: 14, title: "Diseño de logo", description: "Creación de logo profesional", basePrice: 150.0, itemType: "Diseño" },
  { id: 6, creatorId: 15, title: "Fotografía de producto", description: "Sesión fotográfica para e-commerce", basePrice: 200.0, itemType: "Fotografía" },
  { id: 7, creatorId: 16, title: "Ilustración digital", description: "Ilustración personalizada en estilo cartoon", basePrice: 80.0, itemType: "Ilustración" },
  { id: 8, creatorId: 17, title: "Diseño de interfaz", description: "Diseño de interfaz para aplicación móvil", basePrice: 300.0, itemType: "Diseño" }
];

function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setItems(MOCK_ITEMS); // <- mock para probar
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <p>Cargando items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="items-list-container"
      style={{ display: "flex", gap: 50, flexWrap: "wrap", justifyContent: "center" }}
    >
      {items.map((item) => (
        <ItemProduct key={item.id} {...item} />
      ))}
    </div>
  );
}

export default ItemsList;