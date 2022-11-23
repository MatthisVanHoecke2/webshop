import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useSession } from '../contexts/AuthProvider';
import { useError } from '../contexts/DialogProvider';

export default function PrivateRoute({ children, errorMessage }) {
	const { ready } = useSession();
	const { setShowError, setErrorMessage } = useError();

	useEffect(() => {
		if(!ready) {
			setErrorMessage(errorMessage);
			setShowError(true);
		}
		else {
			setShowError(false);
		}
	}, [setShowError, ready, errorMessage, setErrorMessage])

	return (
		 ready ? children : <Navigate to='/'/>
			
		
	);
}