import { useState } from "react";
import { User } from "../../@types/user";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const useStyles = makeStyles({
  root: {
    backgroundColor: '#FFF',
    height: 'calc(100vh - 80px)'
  },
});

interface UserProps {
  users: User[],
  setSelectedUser: any,
}

const List = ({ users, setSelectedUser }: UserProps) => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      {users.map((user) => (
        !user.isCurrent &&
        <Box key={user._id}>
          <Typography variant='body2' onClick={() => setSelectedUser(user)}>{user.email}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default List;