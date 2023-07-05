require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const jobRoutes = require("./routes/job.route");
const cousreRoutes = require("./routes/course.route");
const lessonRoutes = require("./routes/lesson.route");
const newsRoutes = require("./routes/news.route");
const logger2 = require("./services/logger2");
const loggerEvent = require("./services/logger");
const logger = loggerEvent("server");
const contactRoute = require("./routes/contact.routes");
logger.info("Test on server file");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

app.use(logger2);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", jobRoutes);
app.use("/api", cousreRoutes);
app.use("/api", lessonRoutes);
app.use("/api", newsRoutes);
app.use("/api", contactRoute);

const url = process.env.DB_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected !!!!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Database NOT CONNECTED");
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
