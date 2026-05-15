export function ActionButton({ icon, label, large = false, onClick }) {
  return (
    <button
      type="button"
      className={`actionButton${large ? ' large' : ''}`}
      onClick={onClick}
    >
      {icon && <span className="actionButtonIcon">{icon}</span>}
      {label}
    </button>
  );
}

export default ActionButton;
