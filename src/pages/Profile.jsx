import { Button } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { LabelInput } from "../components/FormComponents";
import * as usersApi from "../api/users";
import { useMessage } from "../contexts/DialogProvider";
import dialogs from "../dialogs.json";
import { getErrorMessage } from "../components/GeneralMethods";

export function Profile() {

  return (
    <div className="editpage profile">
      <div className="edit-header">
        <h1>My Profile</h1>
      </div>
      <div className="d-flex">
        <div className="edit-items">
          <div className="list-group list-group-flush">
            <Link to="/profile" className="list-group-item list-group-item-action icon-text"><div><i className="bi bi-pencil-fill"/></div><div>Edit Profile</div></Link>
            <Link to="/profile/security" className="list-group-item list-group-item-action icon-text"><div><i className="bi bi-shield-fill-check"/></div><div>Password & Security</div></Link>
          </div>
        </div>
        <div className="edit-content"><Outlet/></div>
      </div>
    </div>
  );
}

export function EditProfile({ user }) {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const { setShowMessage, setMessage, setMessageTitle } = useMessage();

  const onSubmit = async (data) => {
    data["id"] = user.id;
    await usersApi.saveUser(data).then(() => {
      setMessageTitle('Info');
      setMessage(dialogs.info.profile.updated);
      setShowMessage(true);
    }).catch((err) => {
      const error = getErrorMessage(err);
      setMessageTitle('Error');
      setMessage(error.message);
      setShowMessage(true);
    })
  }

  const validationRules = {
    name: {
      required: "Username is required"
    },
    email: {
      minLength: { value: 2, message: 'Email must be at least 2 characters' }
    }
  };

  return (
    <>
    <FormProvider onSubmit={handleSubmit} errors={errors} register={register}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Edit Profile</h3>
          <LabelInput label="Username" name="name" type="text" lblclass="edit-label" validationRules={validationRules} defaultValue={user?.name}/>
          <LabelInput label="Email" name="email" type="email" lblclass="edit-label" validationRules={validationRules} defaultValue={user?.email}/>
          <Button variant="primary" type='submit'>Save</Button>
        </form>
    </FormProvider>
    </>
  );
}

export function Security({ user }) {
  const {register, handleSubmit, formState: { errors }, watch} = useForm();

  const onSubmit = async (data) => {
    data["id"] = user.id;
    const success = await usersApi.saveUser(data);

    if(success) console.log(success);
  }

  const validationRules = {
    password: {
      required: 'Password is required',
      minLength: { value: 8, message: 'Password must be at least 8 characters'},
      validate: (val) => {
        if(!/\d/.test(val)) return "Password must contain at least 1 numeric value";
      }
    },
    passconfirm: {
      required: 'Password confirmation is required',
      validate: (val) => {
        if(watch('password') !== val) return "Passwords do not match";
      }
    }
  };

  return (
    <>
    <FormProvider onSubmit={handleSubmit} errors={errors} register={register}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Edit Password</h3>
          <LabelInput label="Password" name="password" type="password" lblclass="edit-label" validationRules={validationRules}/>
          <LabelInput label="Confirm Password" name="passconfirm" type="password" lblclass="edit-label" validationRules={validationRules}/>
          <Button variant="primary" type='submit'>Save</Button>
        </form>
    </FormProvider>
    </>
  );
}