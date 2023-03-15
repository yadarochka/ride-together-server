const express = require('express');
const userRouter = require('./routes/user.routes')

const app = express();

app.use(express.json())
app.use('/api', userRouter)

  
// запуск сервера на порту 3000
app.listen(3000, function () {
  console.log('Приложение запущено на http://localhost:3000');
});