import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useSession } from '../contexts/AuthProvider';
import { useError } from '../contexts/DialogProvider';

export default function PrivateRoute({ children, errorMessage }) {
	const { ready } = useSession();
	const { setShowError, setMessage } = useError();

	useEffect(() => {
		if(!ready) {
			setMessage(errorMessage);
			setShowError(true);
		}
		else {
			setShowError(false);
		}
	}, [setShowError, ready, errorMessage, setMessage])

	return (
		 ready ? children : <Navigate to='/'/>
			
		
	);
}