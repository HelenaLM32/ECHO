import { useState, useCallback } from 'react';

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

export default useSuccessPopup;
