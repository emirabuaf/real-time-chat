
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  image: {
    height: '50px',
  },
});

const NavBar = () => {
  const classes = useStyles()
  return (
    <Box sx={{ height: 80 }}>
      <img className={classes.image} src="assets/logo.png" />
    </Box>

  );
};


export default NavBar;