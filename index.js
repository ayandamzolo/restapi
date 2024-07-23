const indexRouter = require("./src/routes/route");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/visitors`);
});
