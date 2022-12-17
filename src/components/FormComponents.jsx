import { memo } from "react";
import { useFormContext } from "react-hook-form";

const LabelInput = memo(function LabelInput({ label, name, type, validationRules, hidden, lblclass, inputclass, ...rest }) {
  const {register, errors} = useFormContext();

  const hasError = name in errors;

  return (
    <div className="form-group" hidden={hidden ?? false}>
      <label htmlFor={name} className={lblclass ?? ""}>{label} </label>   
      <input 
        {...register(name, validationRules[name])}
        id={name}
        type={type}
        className={inputclass ?? "form-control"}
        {...rest}
      />
      {hasError && 
      <div className="form-text text-danger">
        {errors[name].message}
      </div>
      }
    </div>
  );
});

const TextareaInput = memo(function TextareaInput({ label, name, validationRules, lblclass, ...rest }) {
  const {register, errors} = useFormContext();

  const hasError = name in errors;

  return (
    <div className="form-group">
      <label className={lblclass ?? ""} htmlFor={name}>{label} </label>   
      <textarea 
        {...register(name, validationRules[name])}
        id={name}
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
});

const CheckboxInput = memo(function CheckboxInput({ label, name, validationRules, lblclass, ...rest }) {
  const {register, errors} = useFormContext();

  const hasError = name in errors;

  return (
    <div className="form-check">
      <input 
        {...register(name, validationRules[name])}
        id={name}
        type="checkbox" 
        className="form-check-input" 
        {...rest}
      />
      <label className={lblclass ?? "form-check-label"} htmlFor={name}>{label}</label>   
      {hasError && 
      <div className="form-text text-danger">
        {errors[name].message}
      </div>
      }
    </div>
  );
});

export { LabelInput, CheckboxInput, TextareaInput };