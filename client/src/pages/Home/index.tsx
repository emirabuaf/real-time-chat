import { useEffect, useState } from 'react';
import List from '../../components/List';
import Chat from '../../components/Chat';
import Grid from '@mui/material/Grid';
import { User } from "../../@types/user";



const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const token = localStorage.getItem('token');


  useEffect(() => {
    fetch('/users', {
      headers: {
        Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        setUsers(data.users)
        setCurrentUser(data.currentUser)
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={3}>
        <List users={users} setSelectedUser={setSelectedUser} />
      </Grid>
      <Grid item xs={6} md={9}>
        <Chat selectedUser={selectedUser} currentUser={currentUser} />
      </Grid>
    </Grid>

  )
}

export default Home;