import { useCallback, useEffect } from 'react';
import {Modal, Button} from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import LabelInput from '../components/FormComponents';
import { useLogin, useSession } from '../contexts/AuthProvider';
import { useConfirm, useError } from '../contexts/DialogProvider';

export default function Modals({showModal, setShowModal}) {
  const { showSignIn, showSignUp } = showModal;
  const { setShowSignIn, setShowSignUp } = setShowModal;
  return (
    <>
      <SignUp show={showSignUp} handleClose={() => setShowSignUp(false)}/>
      <SignIn show={showSignIn} handleClose={() => setShowSignIn(false)}/>
      <Error/>
    </>
  );
}

function SignUp({show, handleClose}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSumbit = (data) => {
    console.log(JSON.stringify(data));
  }

  const validationRules = {
    user: {
      required: 'Username is required',
      minLength: { value: 2, message: 'Username must be at least 2 characters' }
    },
    email: {
      required: 'Email is required'
    },
    pass: {
      required: 'Password is required',
      minLength: { value: 8, message: 'Password must be at least 8 characters'},
      validate: (val) => {
        if(!/\d/.test(val)) return "Password must contain at least 1 numeric value";
      }
    },
    passconfirm: {
      required: 'Password confirmation is required',
      validate: (val) => {
        if(watch('pass') !== val) return "Passwords do not match";
      }
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <FormProvider onSubmit={handleSubmit} errors={errors} register={register} watch={watch}>
        <form onSubmit={handleSubmit(onSumbit)}>
          <Modal.Header closeButton>
            <Modal.Title className='text-center'>Sign Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <LabelInput
                label="Username"
                name="user"
                type="text"
                validationRules={validationRules}
              />
              <LabelInput
                label="Email address"
                name="email"
                type="email"
                validationRules={validationRules}
              />
              <LabelInput
                label="Create password"
                name="pass"
                type="password"
                validationRules={validationRules}
              />
              <LabelInput
                label="Confirm password"
                name="passconfirm"
                type="password"
                validationRules={validationRules}
              />                                  
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit'>
              Register
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
}

function SignIn({show, handleClose}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const login = useLogin();
  const { loading, error } = useSession();

  const onSumbit = useCallback(async (data) => {
    const success = await login(data.user, data.pass);
    
    if(success) handleClose();
  }, [login, handleClose]);

  const validationRules = {
    user: {
      required: 'This field is required'
    },
    pass: {
      required: 'This field is required'
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <FormProvider onSubmit={handleSubmit} errors={errors} register={register} watch={watch}>
        <form onSubmit={handleSubmit(onSumbit)}>
          <Modal.Header closeButton>
            <Modal.Title className='text-center'>Sign In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <LabelInput
                label="Username or email"
                name="user"
                type="text"
                validationRules={validationRules}
              />
              <LabelInput
                label="Password"
                name="pass"
                type="password"
                validationRules={validationRules}
              />          
              {
						    error ? (
							    <p className="text-red-500">
								    {error}
							    </p>
						    ) : null
					    }                      
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit' disabled={loading}>
              Sign in
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
}

export function Error() {
  const { showError, setShowError, message } = useError();

  return (<Modal show={showError} onHide={() => setShowError(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>{message}</label>
      </Modal.Body>
  </Modal>);
}

export function Confirm() {
  const { showConfirm, setShowConfirm, message } = useConfirm();

  return (<Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>{message}</label>
      </Modal.Body>
  </Modal>);
}