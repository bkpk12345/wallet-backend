require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const { errBuilder } = require("./api/helpers/index");

const connection = require("./config/connection");
connection();

//ROUTES
const walletRoutes = require("./routes/index");

//BODY-PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", walletRoutes);

// Error Handler
app.use((err, req, res, next) => {
  const final_error = errBuilder(err);
  console.log("final_error");
  console.log(final_error);
  return res.status(final_error.statusCode).send(final_error);
});

const port = process.env.PORT ?? 8001;

app.listen(port, () => {
  console.log("server listening to port:", port);
});
