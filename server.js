const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: helmet } = require("helmet");
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const DATABASE = require("./config/db");
const { redirectShort } = require("./controllers/shortController");

const PORT = process.env.PORT;

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        url: "http://localhost:3000",
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
  apis: ["./controllers/*.js"],
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

DATABASE.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server has started running at port http://localhost:${PORT}`);
  });
});
