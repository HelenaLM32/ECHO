import { API_URL } from "./config";

export const getVenuesByUser = async (userId) => {
  const res = await fetch(`${API_URL}/venues/user/${userId}`);
  if (!res.ok) throw new Error("Error al cargar locales");
  return res.json();
};

export const createVenue = async (data) => {
  const token = sessionStorage.getItem("token");
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}/venues`, {
    method: "POST",
    headers: headers,
    body: data instanceof FormData ? data : JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage;
    try {
      const errorObj = JSON.parse(text);
      errorMessage = errorObj.message || errorObj.error;
    } catch {
      errorMessage = text;
    }
    throw new Error(errorMessage || "Error al crear local");
  }

  return res.json();
};

export const deleteVenue = async (venueId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_URL}/venues/${venueId}`, {
    method: "DELETE",
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al eliminar local");
  }
  
  return res.json();
};


export const getVenueById = async (venueId) => {
  const res = await fetch(`${API_URL}/venues/${venueId}`);
  if (!res.ok) throw new Error("Error al cargar el detalle del local");
  return res.json();
};