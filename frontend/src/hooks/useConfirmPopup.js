import { useState, useCallback } from 'react';

// Hook para mostrar un popup de confirmacion (tipo "¿estas seguro?")
// Recibe callbacks para cuando el usuario acepta o cancela
// Devuelve: estado del popup y funciones para mostrar/ocultar/confirmar/cancelar
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

export default useConfirmPopup;
