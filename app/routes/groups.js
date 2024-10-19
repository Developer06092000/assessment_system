const verifyToken = require("../middleware/verifyToken.js");

module.exports = (app) => {
  const Groups = require("../controllers/groups.js");
  var router = require("express").Router();

  router.get("/", verifyToken, Groups.get);
  router.get("/:id/", verifyToken, Groups.get);
  router.post("/", verifyToken, Groups.create);
  router.patch("/:id/", verifyToken, Groups.update);
  router.delete("/:id/", verifyToken, Groups.delete);

  app.use("/groups", router);
};
