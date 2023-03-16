const express = require("express");
const userRouter = require("./routes/user.routes");
const rideRouter = require("./routes/ride.routes");
const ratingRouter = require("./routes/rating.routes");

const app = express();

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/ride", rideRouter);
app.use("/api/rating", ratingRouter);

// запуск сервера на порту 3000
app.listen(3000, function () {
  console.log("Приложение запущено на http://localhost:3000");
});
