import { useState } from "react";

interface FormValues {
  email: string;
  password: string | number;
}

interface FormProps {
  handleSubmit: (values: FormValues) => Promise<void>;
}

const initialValues = {
  email: '',
  password: ''
}

const Form = ({ handleSubmit }: FormProps) => {
  const [values, setValues] = useState(initialValues)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    })
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(values);
  };

  return (
    <form onSubmit={submitForm}>
      <input type='text' name='email' value={values.email} onChange={handleChange} />
      <input type='password' name='password' value={values.password} onChange={handleChange} />
      <button type='submit'>Submit</button>
    </form>
  )
}

export default Form;