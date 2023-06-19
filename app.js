const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rideRouter = require("./routes/ride.routes");
const ratingRouter = require("./routes/rating.routes");
const pingRouter = require("./routes/ping.routes");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const errorMiddleware = require("./middleware/exceptions/error-middleware");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.DEV_CLIENT_URL],
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/ride", rideRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/ping", pingRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", userRouter);

app.use(errorMiddleware);

const PORT = process.env.APP_PORT;
const server = app.listen(PORT, function () {
  console.log(`Приложение запущено PORT = ${PORT}`);
});

module.exports = server;
