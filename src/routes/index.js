const { Router } = require("express");
const foodsRouter = require("./foods.routes");
const requestsRouter = require("./requests.routes");
const myFoodsRouter = require("./myFoods.routes");
const dashboardRouter = require("./dashboard.routes");
const userRouter=require("./users.route")
const router = Router();

router.use("/foods", foodsRouter);
router.use("/requests", requestsRouter);
router.use("/my-foods", myFoodsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/api",userRouter)
module.exports = router;
