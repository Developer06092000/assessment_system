const verifyToken = require("../middleware/verifyToken.js");

module.exports = (app) => {
  const Marks = require("../controllers/marks.js");
  var router = require("express").Router();

  router.get("/", verifyToken, Marks.getParams);
  router.get("/month", verifyToken, Marks.getDate);
  router.get("/year", verifyToken, Marks.getYear);
  router.post("/", verifyToken, Marks.create);
  router.patch("/:id/", verifyToken, Marks.update);
  //   router.delete("/:id/", verifyToken, Students.delete);
  app.use("/marks", router);
};
