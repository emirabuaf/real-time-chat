import Form from "../../components/Form";
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


interface FormValues {
  email: string;
  password: string | number;
}

const SignUp = () => {
  const navigate = useNavigate();


  const handleSubmit = async (values: FormValues) => {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      navigate('/home');
    } else {
      console.log(data.message);
    }
  };

  return (
    <Box>
      <Typography variant="h2">Signup Page</Typography>
      <Form handleSubmit={handleSubmit} />
      <Typography variant="body1">Already have an account? <Link to='/login'>Click here.</Link></Typography>
    </Box>
  )
}

export default SignUp;