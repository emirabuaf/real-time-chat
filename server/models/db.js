const mongoose = require('mongoose')

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/ChatDB', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connection succeeded');
}).catch((err) => {
  console.log('Error in connection' + err);
});

require('./user.model');