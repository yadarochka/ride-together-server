const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rideRouter = require("./routes/ride.routes");
const ratingRouter = require("./routes/rating.routes");
const pingRouter = require("./routes/ping.routes");
const authRouter = require("./routes/auth.routes")

require("dotenv").config();

const app = express();

app.use(express.json())
app.use(cors());
app.use(cookieParser())

app.use(express.json());
app.use("/api/ride", rideRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/ping", pingRouter)
app.use("/api/auth", authRouter)

const PORT = process.env.APP_PORT;
const server = app.listen(PORT, function () {
  console.log(`Приложение запущено PORT = ${PORT}`);
});

module.exports = server