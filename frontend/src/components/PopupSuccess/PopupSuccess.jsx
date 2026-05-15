import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './PopupSuccess.css';

// Hook para manejar popup de éxito
export const useSuccessPopup = () => {
  const [state, setState] = useState({
    isOpen: false,
    message: '',
    title: 'Éxito',
    variant: 'success',
  });

  const show = useCallback((message, title = 'Éxito', variant = 'success') => {
    setState({
      isOpen: true,
      message,
      title,
      variant,
    });
  }, []);

  const hide = useCallback(() => {
    setState({
      isOpen: false,
      message: '',
      title: 'Éxito',
      variant: 'success',
    });
  }, []);

  return {
    successState: state,
    showSuccess: show,
    hideSuccess: hide,
  };
};

// Componente visual
export const PopupSuccess = ({ isOpen, onClose, message, title = 'Éxito', variant = 'success' }) => {
  if (!isOpen) return null;

  const isWarning = variant === 'warning';

  return createPortal(
    <div className="popup-success-overlay" onClick={onClose}>
      <div className="popup-success-container" onClick={(e) => e.stopPropagation()}>
        <div className={`popup-success-icon ${isWarning ? 'popup-success-icon--warning' : ''}`}>
          {isWarning ? (
            <svg className="popup-success-skull-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M0 0h16v12h-2v4H2v-4H0V0zm2 2v8h2v4h1v-2h2v2h2v-2h2v2h1v-4h2V2H2zm6 6l1.414 1.414-.707.707L8 9.414l-.707.707-.707-.707L8 8zm2-3h2v2h-2V5zM4 5h2v2H4V5z" fillRule="evenodd" />
            </svg>
          ) : (
            '✓'
          )}
        </div>
        <h3 className="popup-success-title">{title}</h3>
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
