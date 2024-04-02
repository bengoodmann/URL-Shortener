const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
require("dotenv").config();
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

const DATABASE = require("./config/db");
const { redirectShort } = require("./controllers/shortController");

const PORT = process.env.PORT;

const accessLog = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(morgan("combined", { stream: accessLog }));

const options = {
  definition: {
    openapi: "3.0.1",

    info: {
      title: "URL Shortener",
      version: "1.0.0",
      description: "A URL Shortener API built with expressJS",
    },
    servers: [
      {
        url: "https://url-shortener-fr6k.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsDoc(options);
app.use(
  "/api/v1/docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  })
);

app.use("/api/v1/short", require("./routes/shortRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));
app.get("/:short", redirectShort);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

DATABASE
.sync()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server has started running at port :${PORT}`);
  });
});
