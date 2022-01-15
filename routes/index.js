const route = require("express").Router();
const userControllers = require("../controllers/userControllers");
const categoryControllers = require("../controllers/categoryControllers")



// USER REGIS - LOGIN ROUTE
//route.post("/users/register", userControllers.register);
//route.post("/users/login", userControllers.login);

// MIDDLEWARE CHECK USER
// route.use(userControllers.loginMiddleware);

// USER MANAGEMENT ROUTE
// route.put("/users/:userId", userControllers.edit);
// route.delete("/users/:userId", userControllers.delete);


//MIDDLEWARE CHECK CATEGORY
route.post("/categories", categoryControllers.create)
route.get("/categories", categoryControllers.index)
route.patch("/categories/:categoryId", categoryControllers.update)
route.delete("/categories/:categoryId", categoryControllers.delete)



module.exports = route;
