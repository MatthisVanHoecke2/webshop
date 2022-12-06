import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSession } from '../contexts/AuthProvider';
import { useError } from '../contexts/DialogProvider';

export default function PrivateRoute({ children, errorMessage, requireAdmin }) {
	const { ready, user, loading } = useSession();
	const { setShowError, setMessage } = useError();
	const [child, setChild] = useState((<></>));
	const navigate = useNavigate();

	useEffect(() => {
		if(!loading) {
			if(!ready || (requireAdmin && !user?.isAdmin)) {
				setMessage(errorMessage);
				setShowError(true);
				navigate('/');
			}
			else if((ready && requireAdmin && user?.isAdmin) || (ready && !requireAdmin)) {
				setChild(children);
				setShowError(false);
			}
		}
	}, [children, errorMessage, navigate, ready, requireAdmin, setMessage, setShowError, user, loading]);

	return (
		 child
			
		
	);
}