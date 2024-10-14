// const verifyToken = require("../middleware/verifyToken.js");

module.exports = (app) => {
  const Users = require("../controllers/users.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *      schemas:
   *          Users:
   *              type: object
   *              properties:
   *                  id:
   *                      type: integer
   *                      description: The auto-generated id of the user
   *                  username:
   *                      type: string
   *                      description: The user name
   *                  email:
   *                      type: string
   *                      format: email
   *                      description: The user email
   *                  password:
   *                      type: string
   *                      description: The user password
   *              example:
   *                  id: 1
   *                  username: John
   *                  email: info@gmail.com
   *                  password: 12345678
   */

  /**
   * @swagger
   *     tags:
   *          name: Users
   *          description: The users managing API
   */

  /**
   * @swagger
   *  /auth/register/:
   *      post:
   *          summary: Create a new user
   *          tags: [Users]
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              username:
   *                                  type: string
   *                                  description: Enter the username
   *                              email:
   *                                  type: string
   *                                  format: email
   *                                  description: Enter the email
   *                              password:
   *                                  type: string
   *                                  description: Enter the password
   *                          example:
   *                              username: ""
   *                              email: ""
   *                              password: ""
   *          responses:
   *              200:
   *                  description: The list of the users
   *                  content:
   *                      application/json:
   *                          schema:
   *                              type: string
   *              500:
   *                  description: Some server error
   */

  /**
   * @swagger
   *  /auth/login/:
   *      post:
   *          summary: Logging the user
   *          tags: [Users]
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              username:
   *                                  type: string
   *                                  description: Enter the username
   *                              password:
   *                                  type: string
   *                                  description: Enter the password
   *                          example:
   *                              username: ""
   *                              password: ""
   *          responses:
   *              200:
   *                  description: The list of the users
   *                  content:
   *                      application/json:
   *                          schema:
   *                              type: object
   *                              properties:
   *                                  token:
   *                                      type: string
   *
   *              500:
   *                  description: Some server error
   */

  /**
   * @swagger
   *  /auth/changePassword/:
   *      post:
   *          summary: Change user password
   *          tags: [Users]
   *          required: true
   *          description: Enter the token
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              password:
   *                                  type: string
   *                                  example: ""
   *          responses:
   *              200:
   *                  description: The list of the users
   *                  content:
   *                      application/json:
   *                          schema:
   *                              type: string
   *              500:
   *                  description: Some server error
   */

  router.get("/", Users.get);
  router.post("/register/", Users.register);
  router.post("/login/", Users.login);
  router.post("/change/:id/", Users.update);
  router.post("/change/account/:id/", Users.updateAccount);
  router.delete("/:id/", Users.delete);
  app.use("/auth", router);
};
