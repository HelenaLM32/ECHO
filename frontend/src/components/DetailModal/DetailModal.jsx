import "./DetailModal.css";

export default function DetailModal({ type, data, onClose }) {
  if (!data) return null;

  const isVenue = type === "venue";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {(isVenue ? data.img1 : data.img) && (
          <img
            src={isVenue ? data.img1 : data.img}
            alt={data.name || data.title}
            className="modal-img"
          />
        )}

        <div className="modal-body">
          <h2 className="modal-title">{isVenue ? data.name : data.title}</h2>

          {isVenue && (
            <>
              <p className="modal-field"><span>Dirección</span>{data.address}</p>
              {data.capacity   && <p className="modal-field"><span>Aforo</span>{data.capacity} personas</p>}
              {data.telefono   && <p className="modal-field"><span>Teléfono</span><a href={`tel:${data.telefono}`}>{data.telefono}</a></p>}
              {data.email      && <p className="modal-field"><span>Email</span><a href={`mailto:${data.email}`}>{data.email}</a></p>}
              {data.sitioWeb   && <p className="modal-field"><span>Web</span><a href={data.sitioWeb} target="_blank" rel="noreferrer">{data.sitioWeb}</a></p>}
              {data.horario    && <p className="modal-field"><span>Horario</span>{data.horario}</p>}

              {(data.img2 || data.img3) && (
                <div className="modal-gallery">
                  {data.img2 && <img src={data.img2} alt="foto 2" />}
                  {data.img3 && <img src={data.img3} alt="foto 3" />}
                </div>
              )}
            </>
          )}

          {!isVenue && (
            <>
              {data.categoria && <p className="modal-field"><span>Categoría</span>{data.categoria}</p>}
              <p className="modal-field">
                <span>Fecha</span>
                {data.startDate ? new Date(data.startDate).toLocaleString("es-ES") : "—"}
                {" → "}
                {data.endDate   ? new Date(data.endDate).toLocaleString("es-ES")   : "—"}
              </p>
              <p className="modal-field">
                <span>Precio</span>
                {data.precio != null ? `${data.precio} €` : "Gratuito"}
              </p>
              {data.description && <p className="modal-description">{data.description}</p>}
              {data.linkEntradas && (
                <a
                  href={data.linkEntradas}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-ticket-btn"
                >
                  Comprar entradas
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}