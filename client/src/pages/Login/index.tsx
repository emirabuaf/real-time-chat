import Form from '../../components/Form';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface FormValues {
  email: string;
  password: string | number;
}

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: FormValues) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (data.success) {
      document.cookie = `token=${data.token}`; // set token as cookie
      navigate('/home');
    } else {
      console.log(data.message);
    }
  };

  return (
    <Box>
      <Typography variant="h2">Login Page</Typography>
      <Form handleSubmit={handleSubmit} />
    </Box>
  );
};

export default Login;