const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const rideRouter = require("./routes/ride.routes");
const ratingRouter = require("./routes/rating.routes");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/ride", rideRouter);
app.use("/api/rating", ratingRouter);

const PORT = process.env.APP_PORT;
app.listen(PORT, function () {
  console.log(`Приложение запущено PORT = ${PORT}`);
});
