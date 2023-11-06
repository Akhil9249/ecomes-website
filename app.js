const express = require('express')
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const adminControllers = require("./controller/adminControllers")
const morgan = require('morgan')
require('dotenv').config()
// const { v4: uuidv4 } = require("uuid");
// const session = require('express-session')

const connectDB = require('./server/connection')


const app = express()

connectDB()

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
app.use(morgan('tiny'))

// view engine setup
app.set("view engine", "ejs")
userRouter.set("views","./views/user")
adminRouter.set("views","./views/admin")

// url encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// css,image path setting
userRouter.use("/", express.static("public"));
app.use("/admin", express.static("adminpublic"));
app.use("/admin", express.static("uploads"));
app.use("/", express.static("uploads"));


// router setup
app.use("/", userRouter);
app.use("/admin", adminRouter);

//2
app.get("/admin/users",adminControllers.find)
//3.1
app.get("/admin/check/product",adminControllers.productfind)
//4.1
app.get("/admin/add/category",adminControllers.cartfind)

app.get("/admin/check/category",adminControllers.categoryfind)








// app.get('admin/update-products',adminControllers.update_products)
// app.put('/api/users/:id',abc,adminControllers.update)



app.listen(PORT,()=>console.log(`server started ${PORT}`))