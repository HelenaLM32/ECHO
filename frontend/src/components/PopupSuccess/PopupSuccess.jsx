import React from 'react';
import { createPortal } from 'react-dom';
import './PopupSuccess.css';

// Hook para manejar popup de éxito
export const useSuccessPopup = () => {
  const [successState, setSuccessState] = React.useState({
    isOpen: false,
    message: '',
    title: 'Éxito',
  });

  const showSuccess = React.useCallback((message, title = 'Éxito') => {
    setSuccessState({
      isOpen: true,
      message,
      title,
    });
  }, []);

  const hideSuccess = React.useCallback(() => {
    setSuccessState({
      isOpen: false,
      message: '',
      title: 'Éxito',
    });
  }, []);

  return {
    successState,
    showSuccess,
    hideSuccess,
  };
};

// Componente visual
export const PopupSuccess = ({ isOpen, onClose, message, title = 'Éxito' }) => {
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
    }} onClick={onClose}>
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
          backgroundColor: '#d4edda',
          color: '#155724',
        }}>
          ✓
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
        <button style={{
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: 500,
          cursor: 'pointer',
        }} onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
};

export default PopupSuccess;
