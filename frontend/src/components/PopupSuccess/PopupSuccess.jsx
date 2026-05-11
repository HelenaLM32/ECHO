import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './PopupSuccess.css';

// Hook para manejar popup de éxito
export const useSuccessPopup = () => {
  const [state, setState] = useState({
    isOpen: false,
    message: '',
    title: 'Éxito',
  });

  const show = useCallback((message, title = 'Éxito') => {
    setState({
      isOpen: true,
      message,
      title,
    });
  }, []);

  const hide = useCallback(() => {
    setState({
      isOpen: false,
      message: '',
      title: 'Éxito',
    });
  }, []);

  return {
    successState: state,
    showSuccess: show,
    hideSuccess: hide,
  };
};

// Componente visual
export const PopupSuccess = ({ isOpen, onClose, message, title = 'Éxito' }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="popup-success-overlay" onClick={onClose}>
      <div className="popup-success-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-success-icon">✓</div>
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
