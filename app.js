const express = require("express");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const adminControllers = require("./controller/adminControllers");
const morgan = require("morgan");
require("dotenv").config();
// const { v4: uuidv4 } = require("uuid");
// const session = require('express-session')

const connectDB = require("./server/connection");

const app = express();

connectDB();

//port setting
const PORT = process.env.PORT || 8000;

// app.use(
//     session({
//         secret: uuidv4(),
//         resave: false,
//         saveUninitialized: true,
//     })
//   );
//log requests

app.use(morgan("tiny"));

// view engine setup
app.set("view engine", "ejs");
userRouter.set("views", "./views/user");
adminRouter.set("views", "./views/admin");

// url encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// css,image path setting
userRouter.use("/", express.static("public"));
userRouter.use("/", express.static("uploads"));
adminRouter.use("/admin", express.static("adminpublic"));
adminRouter.use("/admin", express.static("uploads"));


// router setup
app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => console.log(`server started ${PORT}`));
