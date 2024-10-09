const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const db = require("./app/models/index");
const DB = require("./app/config/db.config");

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

async function sequelize() {
  await db.sequelize
    .sync()
    // .sync({ force: true })
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Rent car backend",
        version: "1.0.0",
        description: "Rent car backend API",
      },
      // servers: [
      //     {
      //         url: "http://localhost:8080",
      //     },
      // ]
    },
    apis: ["./app/routes/*.js"],
  };

  const specs = swaggerJsDoc(options);

  app.get("/", (req, res) => {
    res.redirect("/api/");
  });

  app.use("/api", swaggerUI.serve, swaggerUI.setup(specs));

  require("./app/routes/marks.js")(app);
  require("./app/routes/groups.js")(app);
  require("./app/routes/students.js")(app);
  require("./app/routes/users.js")(app);

  const port = process.env.PORT || DB.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
sequelize();
