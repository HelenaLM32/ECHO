import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './PopupConfirm.css';

// Hook para manejar el popup de confirmación
export const useConfirmPopup = () => {
  const [state, setState] = useState({
    isOpen: false,
    message: '',
    title: 'Confirmar',
    onConfirm: null,
    onCancel: null,
  });

  const show = useCallback((message, title = 'Confirmar', onConfirm, onCancel = null) => {
    setState({
      isOpen: true,
      message,
      title,
      onConfirm,
      onCancel,
    });
  }, []);

  const hide = useCallback(() => {
    setState({
      isOpen: false,
      message: '',
      title: 'Confirmar',
      onConfirm: null,
      onCancel: null,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (state.onConfirm) {
      state.onConfirm();
    }
    hide();
  }, [state.onConfirm, hide]);

  const handleCancel = useCallback(() => {
    if (state.onCancel) {
      state.onCancel();
    }
    hide();
  }, [state.onCancel, hide]);

  return {
    confirmState: state,
    showConfirm: show,
    hideConfirm: hide,
    handleConfirm,
    handleCancel,
  };
};

// Componente visual del popup
export const PopupConfirm = ({ isOpen, onConfirm, onCancel, message, title = 'Confirmar' }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="popup-confirm-overlay" onClick={onCancel}>
      <div className="popup-confirm-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-confirm-icon">⚠️</div>
        <h3 className="popup-confirm-title">{title}</h3>
        <p className="popup-confirm-message">{message}</p>
        <div className="popup-confirm-buttons">
          <button className="popup-confirm-btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="popup-confirm-btn-confirm" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupConfirm;
