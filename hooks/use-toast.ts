import { useCallback, useState } from 'react';

export interface ToastState {
  visible: boolean;
  message: string;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    visible: toast.visible,
    message: toast.message,
    showToast,
    dismissToast,
  };
}
