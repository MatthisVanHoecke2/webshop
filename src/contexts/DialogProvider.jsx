import { useContext, useMemo, useState } from "react";
import { createContext } from "react";

const DialogContext = createContext();

const useDialogContext = () => useContext(DialogContext);

export const useMessage = () => {
  const { showMessage, setShowMessage, message, setMessage, messageTitle, setMessageTitle } = useDialogContext();
  return { showMessage, setShowMessage, message, setMessage, messageTitle, setMessageTitle };
}

export const useConfirm = () => {
  const { showConfirm, setShowConfirm, message, setMessage, confirm, setConfirm, subject, setSubject  } = useDialogContext();
  return { showConfirm, setShowConfirm, message, setMessage, confirm, setConfirm, subject, setSubject };
}

export const DialogProvider = ({ children }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [subject, setSubject] = useState('');

  const value = useMemo(() => ({
    showMessage,
    setShowMessage,
    message,
    setMessage,
    messageTitle,
    setMessageTitle,
    showConfirm,
    setShowConfirm,
    confirm,
    setConfirm,
    subject,
    setSubject
  }), [showMessage, setShowMessage, message, setMessage, messageTitle, setMessageTitle, showConfirm, setShowConfirm, confirm, setConfirm, subject, setSubject])
  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}