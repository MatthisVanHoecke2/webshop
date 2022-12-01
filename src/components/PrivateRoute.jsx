import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useSession } from '../contexts/AuthProvider';
import { useError } from '../contexts/DialogProvider';

export default function PrivateRoute({ children, errorMessage, requireAdmin }) {
	const { ready, user } = useSession();
	const { setShowError, setMessage } = useError();

	useEffect(() => {
		if(!ready || (requireAdmin && !user?.isAdmin)) {
			setMessage(errorMessage);
			setShowError(true);
		}
		else {
			setShowError(false);
		}
	}, [setShowError, ready, errorMessage, setMessage, requireAdmin, user]);

	return (
		 (ready && requireAdmin && user?.isAdmin) || (ready && !requireAdmin) ? children : <Navigate to='/'/>
			
		
	);
}