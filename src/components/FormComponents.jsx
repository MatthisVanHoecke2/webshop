import { useFormContext } from "react-hook-form";

function LabelInput({ label, name, type, validationRules, ...rest }) {
  const {register, errors} = useFormContext();

  const hasError = name in errors;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label} </label>   
      <input 
        {...register(name, validationRules[name])}
        id={name}
        type={type} 
        className="form-control" 
        {...rest}
      />
      {hasError && 
      <div className="form-text text-danger">
        {errors[name].message}
      </div>
      }
    </div>
  );
}

export default LabelInput;