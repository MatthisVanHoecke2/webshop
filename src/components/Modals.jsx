import { memo, useCallback } from 'react';
import {Modal, Button} from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { LabelInput } from './FormComponents';
import { useLogin, useSession, useSignUp } from '../contexts/AuthProvider';
import { useConfirm, useMessage } from '../contexts/DialogProvider';

export default memo(function Modals({showModal, setShowModal}) {
  const { showSignIn, showSignUp } = showModal;
  const { setShowSignIn, setShowSignUp } = setShowModal;
  return (
    <>
      <SignUp show={showSignUp} handleClose={() => setShowSignUp(false)}/>
      <SignIn show={showSignIn} handleClose={() => setShowSignIn(false)}/>
      <Message/>
      <Confirm/>
    </>
  );
})

const SignUp = memo(function SignUp({show, handleClose}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const signup = useSignUp();
  const {loading, error} = useSession();

  const onSubmit = async (data) => {
    const success = await signup(data);
    
    if(success) handleClose();
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
    <Modal data-cy="sign_up_modal" show={show} onHide={handleClose}>
      <FormProvider onSubmit={handleSubmit} errors={errors} register={register} watch={watch}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title className='text-center'>Sign Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <LabelInput
                data-cy="input_username"
                label="Username"
                name="user"
                type="text"
                validationRules={validationRules}
              />
              <LabelInput
                data-cy="input_email"
                label="Email address"
                name="email"
                type="email"
                validationRules={validationRules}
              />
              <LabelInput
                data-cy="input_password"
                label="Create password"
                name="pass"
                type="password"
                validationRules={validationRules}
              />
              <LabelInput
                data-cy="input_confirm"
                label="Confirm password"
                name="passconfirm"
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
          <Modal.Footer className='justify-content-between'>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button data-cy="sign_up_submit" variant="primary" disabled={loading} type='submit'>
              Register
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
});

const SignIn = memo(function SignIn({show, handleClose}) {
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
                data-cy="sign_in_user"
                validationRules={validationRules}
              />
              <LabelInput
                label="Password"
                name="pass"
                type="password"
                data-cy="sign_in_pass"
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
          <Modal.Footer className='justify-content-between'>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type='submit' disabled={loading} data-cy="sign_in_submit">
              Sign in
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
});

const Message = memo(function Message() {
  const { showMessage, setShowMessage, message, messageTitle } = useMessage();
  return (<Modal show={showMessage} onHide={() => setShowMessage(false)}>
      <Modal.Header closeButton>
        <Modal.Title data-cy="notification">{messageTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>{message}</label>
      </Modal.Body>
  </Modal>);
})

const Confirm = memo(function Confirm() {
  const { showConfirm, setShowConfirm, message, setConfirm } = useConfirm();

  const handleClose = useCallback(() => {
    setConfirm(false);
    setShowConfirm(false)
  }, [setConfirm, setShowConfirm]);

  const handleConfirm = useCallback(() => {
    setConfirm(true);
    setShowConfirm(false)
  }, [setConfirm, setShowConfirm]);

  return (<Modal show={showConfirm} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>{message}</label>
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button data-cy="confirm_modal_submit" variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
  </Modal>);
});

export {SignIn, SignUp, Message, Confirm};