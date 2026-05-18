import { useState, useCallback } from 'react';

// Este hook sirve para mostrar un popup cuando algo sale bien
// Devuelve: el estado del popup y funciones para mostrarlo y ocultarlo
// Ejemplo: const { showSuccess } = useSuccessPopup();
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

export default useSuccessPopup;
