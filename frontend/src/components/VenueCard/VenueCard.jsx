import './VenueCard.css';

function VenueCard({ venue }) {
  const name = venue.name || 'Local';
  const address = venue.address || '';
  const capacity = venue.capacity;
  const coverImg = venue.img1 || venue.img2 || venue.img3;
  const initials = name.charAt(0).toUpperCase();

  return (
    <div className="vc-card-wrapper">
      <article className="vc-card">
        <div className="vc-cover">
          {coverImg ? (
            <img src={coverImg} alt={name} className="vc-cover-img" />
          ) : (
            <div className="vc-cover-fallback">{initials}</div>
          )}
        </div>
        <div className="vc-footer">
          <div className="vc-meta">
            <h3 className="vc-title">{name}</h3>
            {address && <p className="vc-address">{address}</p>}
          </div>
          {capacity != null && (
            <div className="vc-capacity">{capacity} cap.</div>
          )}
        </div>
      </article>
    </div>
  );
}

export default VenueCard;
