import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './PopupConfirm.css';

// Hook para manejar el popup de confirmación
export const useConfirmPopup = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    title: 'Confirmar',
    onConfirm: null,
    onCancel: null,
  });

  const showConfirm = useCallback((message, title = 'Confirmar', onConfirm, onCancel = null) => {
    setConfirmState({
      isOpen: true,
      message,
      title,
      onConfirm,
      onCancel,
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState({
      isOpen: false,
      message: '',
      title: 'Confirmar',
      onConfirm: null,
      onCancel: null,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
    hideConfirm();
  }, [confirmState.onConfirm, hideConfirm]);

  const handleCancel = useCallback(() => {
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
    hideConfirm();
  }, [confirmState.onCancel, hideConfirm]);

  return {
    confirmState,
    showConfirm,
    hideConfirm,
    handleConfirm,
    handleCancel,
  };
};

// Componente visual del popup
export const PopupConfirm = ({ isOpen, onConfirm, onCancel, message, title = 'Confirmar' }) => {
  if (!isOpen) return null;

  const popupContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
    }} onClick={onCancel}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px 32px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0 auto 16px',
          backgroundColor: '#fff3cd',
          color: '#856404',
        }}>
          ⚠️
        </div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '0 0 12px 0',
          color: '#333',
        }}>{title}</h3>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 24px 0',
          lineHeight: 1.5,
        }}>{message}</p>
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
        }}>
          <button style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
          }} onClick={onCancel}>
            Cancelar
          </button>
          <button style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
          }} onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
};

export default PopupConfirm;
