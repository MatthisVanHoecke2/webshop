import { useContext, useMemo, useState } from "react";
import { createContext } from "react";

const DialogContext = createContext();

const useDialogContext = () => useContext(DialogContext);

export const useError = () => {
  const { showError, setShowError, message, setMessage } = useDialogContext();
  return { showError, setShowError, message, setMessage };
}

export const useConfirm = () => {
  const { showConfirm, setShowConfirm, message, setMessage, confirm, setConfirm  } = useDialogContext();
  return { showConfirm, setShowConfirm, message, setMessage, confirm, setConfirm };
}

export const DialogProvider = ({ children }) => {
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirm, setConfirm] = useState(false);


  const value = useMemo(() => ({
    showError,
    setShowError,
    message,
    setMessage,
    showConfirm,
    setShowConfirm,
    confirm,
    setConfirm,
  }), [showError, setShowError, message, setMessage, showConfirm, setShowConfirm, confirm, setConfirm])
  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}