import { createPortal } from 'react-dom';
import './PopupConfirm.css';

// Componente visual del popup
export const PopupConfirm = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  title = 'Confirmar',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="popup-confirm-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="popup-confirm-title">
      <div className="popup-confirm-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-confirm-icon">
          <svg className="popup-skull-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 0h16v12h-2v4H2v-4H0V0zm2 2v8h2v4h1v-2h2v2h2v-2h2v2h1v-4h2V2H2zm6 6l1.414 1.414-.707.707L8 9.414l-.707.707-.707-.707L8 8zm2-3h2v2h-2V5zM4 5h2v2H4V5z" fillRule="evenodd"/>
          </svg>
        </div>
        <h3 id="popup-confirm-title" className="popup-confirm-title">{title}</h3>
        <p className="popup-confirm-message">{message}</p>
        <div className="popup-confirm-buttons">
          <button className="popup-confirm-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="popup-confirm-btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupConfirm;
