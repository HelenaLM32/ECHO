import { createPortal } from 'react-dom';
import './PopupSuccess.css';

// Componente visual
export const PopupSuccess = ({ isOpen, onClose, message, title = 'Éxito', variant }) => {
  if (!isOpen) return null;

  const normalizedTitle = String(title || '').toLowerCase();
  const normalizedMessage = String(message || '').toLowerCase();

  let resolvedVariant = variant;
  if (!resolvedVariant) {
    if (
      normalizedTitle.includes('accion requerida')
      || normalizedTitle.includes('acción requerida')
      || normalizedMessage.includes('iniciar sesion')
      || normalizedMessage.includes('iniciar sesión')
      || normalizedMessage.includes('inicia sesion')
      || normalizedMessage.includes('inicia sesión')
    ) {
      resolvedVariant = 'info';
    } else if (
      normalizedTitle.includes('error')
      || normalizedMessage.includes('internal server error')
    ) {
      resolvedVariant = 'error';
    } else {
      resolvedVariant = 'success';
    }
  }

  const isWarning = resolvedVariant === 'warning';
  const isInfo = resolvedVariant === 'info';
  const isError = resolvedVariant === 'error';

  return createPortal(
    <div className="popup-success-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="popup-success-title">
      <div className="popup-success-container" onClick={(e) => e.stopPropagation()}>
        <div className={`popup-success-icon ${isWarning ? 'popup-success-icon--warning' : ''} ${isInfo ? 'popup-success-icon--info' : ''} ${isError ? 'popup-success-icon--error' : ''}`}>
          {isInfo ? (
            <img
              className="popup-success-svg-icon"
              src="/project/ECHOSVGS/square-info-svgrepo-com.svg"
              alt="Información"
            />
          ) : isError ? (
            <img
              className="popup-success-svg-icon"
              src="/project/ECHOSVGS/cross-svgrepo-com.svg"
              alt="Error"
            />
          ) : isWarning ? (
            <svg className="popup-success-skull-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M0 0h16v12h-2v4H2v-4H0V0zm2 2v8h2v4h1v-2h2v2h2v-2h2v2h1v-4h2V2H2zm6 6l1.414 1.414-.707.707L8 9.414l-.707.707-.707-.707L8 8zm2-3h2v2h-2V5zM4 5h2v2H4V5z" fillRule="evenodd" />
            </svg>
          ) : (
            '✓'
          )}
        </div>
        <h3 id="popup-success-title" className="popup-success-title">{title}</h3>
        <p className="popup-success-message">{message}</p>
        <button className="popup-success-btn" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>,
    document.body
  );
};

export default PopupSuccess;
