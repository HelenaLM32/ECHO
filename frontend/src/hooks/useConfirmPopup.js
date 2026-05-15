import { useState, useCallback } from 'react';

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

export default useConfirmPopup;
