import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import NavBar from './components/NavBar'
import Container from '@mui/material/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#9999FF',
  },
});

function App() {
  const classes = useStyles()
  return (
    <Router>
      <Container className={classes.root}>
        <NavBar />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
