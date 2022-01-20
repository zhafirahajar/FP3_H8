const route = require("express").Router();
const userControllers = require("../controllers/userControllers");
const categoryControllers = require("../controllers/categoryControllers");
const productControllers = require("../controllers/productControllers");
const transactionControllers = require("../controllers/transactionControllers");
const loginMiddleware = require("../libs/authenticationLibs");

// USER REGIS - LOGIN ROUTE
route.post("/users/register", userControllers.register);
route.post("/users/login", userControllers.login);

// USER TOP UP
route.post("/users/topup", userControllers.topUp);

// MIDDLEWARE CHECK USER
route.use(loginMiddleware.loginMiddleware);

// USER MANAGEMENT ROUTE
route.put("/users/:userId", userControllers.edit);
route.delete("/users/:userId", userControllers.delete);

// CRUD CATEGORY
route.post("/categories", categoryControllers.create);
route.get("/categories", categoryControllers.index);
route.patch("/categories/:categoryId", categoryControllers.update);
route.delete("/categories/:categoryId", categoryControllers.delete);

// CRUD PRODUCT
route.post("/products", productControllers.create);
route.get("/products", productControllers.index);
route.put("/products/:productId", productControllers.update);
route.patch("/products/:productId", productControllers.changeCategory);
route.delete("/products/:productId", productControllers.delete);

// TRANSACTION HISTORY
route.post("/transactions", transactionControllers.create);
route.get("/transactions/user", transactionControllers.index);
route.get("/transactions/admin", transactionControllers.admin);
route.get("/transactions/:transactionsId", transactionControllers.getOne);

module.exports = route;
