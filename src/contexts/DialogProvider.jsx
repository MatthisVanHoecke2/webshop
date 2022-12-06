import { useContext, useMemo, useState } from "react";
import { createContext } from "react";

const DialogContext = createContext();

const useDialogContext = () => useContext(DialogContext);

export const useInfo = () => {
  const { showInfo, setShowInfo, message, setMessage } = useDialogContext();
  return { showInfo, setShowInfo, message, setMessage };
}

export const useError = () => {
  const { showError, setShowError, message, setMessage } = useDialogContext();
  return { showError, setShowError, message, setMessage };
}

export const useConfirm = () => {
  const { showConfirm, setShowConfirm, message, setMessage, confirm, setConfirm, subject, setSubject  } = useDialogContext();
  return { showConfirm, setShowConfirm, message, setMessage, confirm, setConfirm, subject, setSubject };
}

export const DialogProvider = ({ children }) => {
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [subject, setSubject] = useState('');

  const value = useMemo(() => ({
    showError,
    setShowError,
    showInfo,
    setShowInfo,
    message,
    setMessage,
    showConfirm,
    setShowConfirm,
    confirm,
    setConfirm,
    subject,
    setSubject
  }), [showInfo, setShowInfo, showError, setShowError, message, setMessage, showConfirm, setShowConfirm, confirm, setConfirm, subject, setSubject])
  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}