const route = require("express").Router();
const userControllers = require("../controllers/userControllers");

// USER REGIS - LOGIN ROUTE
route.post("/users/register", userControllers.register);
route.post("/users/login", userControllers.login);

// MIDDLEWARE CHECK USER
// route.use(userControllers.loginMiddleware);

// USER MANAGEMENT ROUTE
// route.put("/users/:userId", userControllers.edit);
// route.delete("/users/:userId", userControllers.delete);

module.exports = route;
