const verifyToken = require("../middleware/verifyToken.js");

module.exports = (app) => {
  const Students = require("../controllers/students.js");
  var router = require("express").Router();

  router.get("/", verifyToken, Students.getParams);
  router.post("/", verifyToken, Students.create);
  router.patch("/:id/", verifyToken, Students.update);
  router.delete("/:id/", verifyToken, Students.delete);
  app.use("/students", router);
};
