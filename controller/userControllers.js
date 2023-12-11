const axios = require("axios");
const Userdb = require("../models/userModel");
const Productdb = require("../models/productModel");
const Adressdb = require("../models/addressModel");
const Ordersdb = require("../models/ordersModel");
const Offer = require("../models/offerModel");
const Coupon = require("../models/couponModel");
const Dashdb = require("../models/dashModel");
const Razorpay = require("razorpay");

//1

const home = async (req, res) => {
    const offerhf = await Offer.findOne({ name: "HEADPHONE" });
    const offersp = await Offer.findOne({ name: "SPEAKER" });

    const productwa = await Productdb.find({ category: "WATCH", isAvailable: true });
    const producthe = await Productdb.find({ category: "HEADPHONE", isAvailable: true });
    const productsp = await Productdb.find({ category: "SPEAKER", isAvailable: true });
    const products = await Productdb.find();
    let prowish = [];
    let procart = [];

    if (req.session.isAvailable) {
        const id = req.session.isAvailable;
        const value = await Userdb.find({ _id: id });

        let val = {
            v: 1,
        };
        let user = await Userdb.findById({ _id: req.session.isAvailable });
        const wish = user.wishlist.item.map((val) => val.productId);
        prowish = await Productdb.find({ _id: { $in: wish } });

        console.log(prowish + "prowish");

        const cart = user.cart.item.map((val) => val.productId);
        procart = await Productdb.find({ _id: { $in: cart } });
        console.log(procart + " procart");

        res.render("home", {
            productwa,
            producthe,
            productsp,
            products,
            details: value,
            test: val,
            offerhf,
            offersp,
            prowish,
            procart,
        });
    } else {
        let val = {
            v: 0,
        };

        res.render("home", { productwa, producthe, productsp, products, test: val, offerhf, offersp, prowish, procart });
    }
};

//2
const register = (req, res) => {
    let val = {
        v: 0,
    };
    res.render("register", { test: val });
};

//3
const signin = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
    };

    try {
        const check = await Userdb.findOne({ email: req.body.email });

        if (check.email == data.email && check.password == data.password) {
            req.session.isAvailable = check._id;
            if (check.isVerified == true) {
                res.redirect("/");
            } else {
                res.redirect("/login");
            }
        }
    } catch (error) {
        console.log(error);
    }
};

//4
const login = (req, res) => {
    let val = {
        v: 0,
    };
    res.render("login", { test: val });
};

//5
const logout = (req, res, next) => {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

//6
const product = async (req, res) => {
    let val = {
        v: 0,
    };
    const producttop = await Productdb.find();
    axios
        .get("http://localhost:3000/check/product")
        .then((response) => {
            console.log("end");
            res.render("product", { producttop, products: response.data, test: val });
        })
        .catch((err) => {
            res.send(err);
        });
};

//7
const single_product = (req, res) => {
    let val = {
        v: 0,
    };
    axios
        .get("http://localhost:3000/user/check/product", { params: { id: req.query.id } })

        .then(function (userdata) {
            res.render("single-product", { user: userdata.data, test: val });
        })
        .catch((err) => {
            res.send(err);
        });
};

//8
const wishlist = async (req, res) => {
    let val = {
        v: 1,
    };

    if (req.session.isAvailable) {
        let arr = [];

        let pro = [];

        let user = {};

        const sess = req.session.isAvailable;

        user = await Userdb.findById({ _id: req.session.isAvailable });
        const value = user.wishlist.item.map((val) => val.productId);

        pro = await Productdb.find({ _id: { $in: value } });

        res.render("wishlist", { products: pro, test: val, sessval: sess, userdt: user });
    } else {
        res.redirect("/login");
    }
};

//9
const cart = async (req, res) => {
    if (req.session.isAvailable) {
        const sess = req.session.isAvailable;

        let val = {
            v: 1,
        };

        let arr = [];

        let pro = [];

        let user = {};

        let flultotal = 0;

        user = await Userdb.findByIdAndUpdate({ _id: req.session.isAvailable });
        const value = user.cart.item.map((val) => val.productId);

        const fultot = user.cart.item.map((val) => {
            const res = val.qty * val.price;
            return res;
        });

        flultotal = fultot.reduce((tot, val) => {
            return tot + val;
        }, 0);

        user.cart.totalPrice = flultotal;
        user.save();

        pro = await Productdb.find({ _id: { $in: value } });

        res.render("cart", { products: pro, test: val, sessval: sess, userdt: user, total: flultotal });
    } else {
        res.redirect("/login");
    }
};

//10
const dashboard = async (req, res) => {
    if (req.session.isAvailable) {
        let val = {
            v: 1,
        };
        const id = req.session.isAvailable;
        const user = await Adressdb.find({ userId: id });
        const value = await Userdb.find({ _id: id });
        const orders = await Ordersdb.find({ userId: id });
        const product = await Productdb.find({});
        res.render("dashboard", { products: user, details: value, test: val, orders, product });
    } else {
        res.redirect("/login");
    }
};

//11
const forgotnumber = (req, res) => {
    let val = {
        v: 0,
    };

    res.render("forgot-number", { user: 0, test: val });
};

//12
const newpassword = (req, res) => {
    let val = {
        v: 0,
    };
    res.render("newpassword", { test: val });
};

//13
const checknumber = async (req, res) => {
    const data = {
        mobile: req.body.mobile,
    };

    try {
        const check = await Userdb.findOne({ mobile: req.body.mobile });

        if (check.mobile == data.mobile) {
            req.session.val = check._id;
            // req.session.isAvailable = req.body.email;
            res.redirect("/otppage");
        }
    } catch (error) {
        console.log(data);
        if (data.mobile == "") {
            res.render("forgot-number", { user: 0 });
        } else {
            res.render("forgot-number", { user: 1 });
        }

        console.log(error);
    }
};

//14
const generate = (req, res, next) => {
    // start ...............................................
    // Function to generate a random number between 1111 and 9999
    function generateRandomNumber() {
        const randomNum = Math.floor(Math.random() * (9999 - 1111 + 1) + 1111);
        return randomNum;
    }

    // Call the function and store the result
    const randomResult = generateRandomNumber();
    console.log(randomResult);

    // Define a function to be called with the random number
    function processRandomNumber(randomNum) {
        console.log(`Random number generated: ${randomNum}`);
        // You can perform any further processing with the random number here
    }

    // Call the function with the random number
    processRandomNumber(randomResult);
    // end ...............................................

    req.session.myValue = randomResult;
    next();
};

//15
const otppage = (req, res) => {
    res.render("otp");
};

//16
const otppost = (req, res) => {
    const result = req.body.first + req.body.second + req.body.third + req.body.fourth;
    if (req.session.myValue == result) {
        req.session.myValue = "";
        res.redirect("/newpassword");
    } else {
        req.session.myValue = "";
        res.redirect("/otppage");
    }
};

//17
const passwordchange = async (req, res) => {
    const pass = req.body.password1;
    const value = req.session.val;
    const user = await Userdb.findByIdAndUpdate({ _id: value }, { $set: { password: pass } });
    await user.save();
    res.redirect("/login");
};

//18
const addcartput = async (req, res) => {
    if (req.session.isAvailable) {
        const id = req.session.isAvailable;

        const productId = req.body.id;

        const price = req.body.price;
        let users = await Userdb.findById({ _id: req.session.isAvailable });
        let alredycart = 0;
        const cart = users.cart.item.find((val) => {
            if (productId == val.productId) {
                alredycart = 1;
                return alredycart;
            }
        });

        if (alredycart == 0) {
            const singletotal = req.body.price;
            const qty = 1;
            const user = await Userdb.findByIdAndUpdate(id);
            if (!user) {
                throw new Error("User not found");
            }
            user.cart.item.push({ productId, qty, price, singletotal });
            user.cart.totalPrice += price * qty;
            await user.save();
        }
    } else {
        res.render("login");
    }
};

//enddddddd
// const addcartend = async (req, res) => {
//     console.log("adddddenddddd")
//     res.send("haiii")
// };

//19
const addwishlistput = async (req, res) => {
    if (req.session.isAvailable) {
        const id = req.session.isAvailable;
        const productId = req.body.id;
        const price = req.body.price;

        const qty = 1;

        //    const price = 2500
        // const id = req.params.id;
        // Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })

        const user = await Userdb.findByIdAndUpdate(id);
        if (!user) {
            throw new Error("User not found");
        }
        let alredywishlist = 0;
        const cart = user.wishlist.item.find((val) => {
            if (productId == val.productId) {
                alredywishlist = 1;
                return alredywishlist;
            }
        });

        if (alredywishlist == 0) {
            user.wishlist.item.push({ productId, price });
            await user.save();
        }
    } else {
        res.render("login");
    }
};

//20

const dashboardpost = (req, res) => {
    //validate request

    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }
    console.log(req.session.isAvailable + "isAvailable....");
    if (req.session.isAvailable) {
        //new Adress
        const user = new Adressdb({
            userId: req.session.isAvailable,
            fullname: req.body.name,
            phone1: req.body.number,
            pincode: req.body.pincode,
            state: req.body.state,
            city: req.body.city,
            houseNo: req.body.house,
            roadName: req.body.road,
        });

        //save user in the database
        user.save(user)
            .then((data) => {
                res.redirect("/dashboard");
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "some error",
                });
            });
    } else {
        res.render("login");
    }
};

//15
const checkout = async (req, res) => {
    if (req.session.isAvailable) {
        const sess = req.session.isAvailable;
        let val = {
            v: 1,
        };
        let user = {};

        // let arr = [];

        let pro = [];
        let coupon = [];

        let userad = {};

        let flultotal = 0;

        user = await Userdb.findById({ _id: req.session.isAvailable });
        console.log(user);
        const value = user.cart.item.map((val) => val.productId);
        console.log(value);

        const fultot = user.cart.item.map(async (valus) => {
            const res = valus.qty * valus.price;
            // 88888888888888888888888888888888888888888888888888888888888888888888

            //    let offer = await Offer.find({});
            //    offer.map((valof)=>{
            //      if(valus.name == valof.categoryname){
            //         if(valof.avilable){
            //         }
            //      }
            //    })

            return res;
        });
        // **********************************************
        // flultotal = fultot.reduce((tot, val) => {
        //     return tot + val;
        // }, 0);

        // user.cart.totalPrice = flultotal
        // await user.save(user.cart.totalPrice)
        // **********************************************

        pro = await Productdb.find({ _id: { $in: value } });

        const id = req.session.isAvailable;
        userad = await Adressdb.find({ userId: id });

        // user = await Userdb.findById({ _id: req.session.isAvailable });

        // const value = await Userdb.find({ _id: id });

        // res.render("dashboard", { products: user, details: value, test: val });

        // res.render("cart", { products: pro, test: val, sessval: sess, userdt: user, total: flultotal });

        // coupon = await Coupon.find({});
        coupon = await Coupon.find({ usedBy: { $nin: [sess] } });

        //   console.log(coupon)

        res.render("checkout", {
            test: val,
            productad: userad,
            products: pro,
            sessval: sess,
            userdt: user,
            total: flultotal,
            coupon,
        });
    } else {
        res.redirect("/login");
    }
};

const cartupdat = async (req, res) => {
    const idvalue = req.body.idvalues;
    const sessvalue = req.body.sessvalues;
    const changenum = req.body.change;
    const user = await Userdb.findByIdAndUpdate({ _id: sessvalue });

    const index = user.cart.item.indexOf(
        user.cart.item.find((val) => {
            return val.productId == idvalue;
        })
    );

    console.log(index);
    if (changenum == 1) {
        const quantity = user.cart.item[index].qty;
        user.cart.item[index].qty++;
        await user.save();
        let valp = user.cart.item[index].price;
        let valq = user.cart.item[index].qty;
        user.cart.item[index].singletotal = valp * valq;
        await user.save();

        // const prid = user.cart.item[index].productId
        // const product = await Productdb.findByIdAndUpdate({ _id: prid });
        // product.stock--
        // await product.save();
        // console.log(product)
    } else {
        const quantity = user.cart.item[index].qty;

        user.cart.item[index].qty--;

        await user.save();

        let valp = user.cart.item[index].price;
        let valq = user.cart.item[index].qty;
        user.cart.item[index].singletotal = valp * valq;
        await user.save();

        // const prid = user.cart.item[index].productId
        // const product = await Productdb.findByIdAndUpdate({ _id: prid });
        // product.stock++
        // await product.save();
        // console.log(product)
    }

    await Userdb.findById({ _id: sessvalue })

        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.json(100);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

const cartremove = async (req, res) => {
    const idvalue = req.body.idvalues;
    const sessvalue = req.body.sessvalues;

    const user = await Userdb.findByIdAndUpdate({ _id: sessvalue });

    const index = user.cart.item.indexOf(
        user.cart.item.find((val, ind) => {
            return val.productId == idvalue;
        })
    );
    user.cart.item.splice(index, 1);
    await user.save();
    Userdb.findByIdAndUpdate({ _id: sessvalue })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

const wishlistremove = async (req, res) => {
    const idvalue = req.body.idvalues;
    const sessvalue = req.body.sessvalues;

    const user = await Userdb.findByIdAndUpdate({ _id: sessvalue });

    const index = user.wishlist.item.indexOf(
        user.wishlist.item.find((val, ind) => {
            return val.productId == idvalue;
        })
    );

    user.wishlist.item.splice(index, 1);

    await user.save();

    Userdb.findByIdAndUpdate({ _id: sessvalue })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

const oddersuccess = async (req, res) => {
    if (req.session.isAvailable) {
        const sess = req.session.isAvailable;
        let val = {
            v: 1,
        };

        let user = {};

        // let arr = [];

        let pro = [];

        let userad = {};

        let flultotal = 0;

        user = await Userdb.findById({ _id: req.session.isAvailable });
        const value = user.cart.item.map((val) => val.productId);

        const fultot = user.cart.item.map((val) => {
            const res = val.qty * val.price;
            return res;
        });

        flultotal = fultot.reduce((tot, val) => {
            return tot + val;
        }, 0);

        pro = await Productdb.find({ _id: { $in: value } });

        const id = req.session.isAvailable;
        userad = await Adressdb.find({ userId: id });

        user = await Userdb.findById({ _id: req.session.isAvailable });

        res.render("oddersuccess", {
            test: val,
            productad: userad,
            products: pro,
            sessval: sess,
            userdt: user,
            total: flultotal,
        });
    } else {
        res.redirect("/login");
    }
};

const oddersuccesspost = async (req, res) => {
    const addressid = req.body.addresid;
    const paymentmethode = req.body.payment;

    console.log(addressid);
    console.log(paymentmethode);

    if (paymentmethode == "Cash on delivery") {
        const userid = req.session.isAvailable;
        const user = await Userdb.findById({ _id: req.session.isAvailable });
        const value = user.cart.item.map(async (val, i) => {
            let prid = val.productId;

            const product = await Productdb.findById({ _id: prid });

            let prs = product.stock;

            let pri = val.qty;

            if (prs - pri <= 0) {
                
                console.log("less.....................................");
            }

            product.stock = prs - pri;
            product.save();
        });

        const Adress = await Adressdb.findById({ _id: addressid });

        const Orders = new Ordersdb({
            userId: userid,
            payment: req.body.payment,
            fullname: Adress.fullname,
            phone1: Adress.phone1,
            pincode: Adress.pincode,
            state: Adress.state,
            city: Adress.city,
            houseNo: Adress.houseNo,
            roadName: Adress.roadName,
            // createdAt: true,
            status: "pending",
            productReturned: 0,
        });

        //save Orders in the database
        Orders.save(user)
            .then((data) => {})
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "some error",
                });
            });

        user.cart.item.map(async (val, i) => {
            let productId = val.productId;
            let qty = val.qty;
            let price = val.price;

            Orders.products.item.push({ productId, qty, price });
        });

        let total = Orders.products.item.reduce((tot, val) => {
            return tot + val.price * val.qty;
        }, 0);

        Orders.products.totalPrice = total;

        const dash = await Dashdb.findOneAndUpdate({});
        dash.order += 1;
        dash.sale += 1;
        dash.rupee += total;
        dash.profit += total;
        dash.save();
    }

    //  **********************************************************

    // if(paymentmethode=="Razorpay"){
    //     const instance = new Razorpay({
    //         // key_id: key_id,
    //         key_id:"rzp_test_zVBhrL4CVfIezv",
    //         key_secret: "HeU66JXIWNBWFHC1vnC6qB7X"
    //     });
    //     let order = await instance.orders.create({
    //         amount: 500 * 100,
    //         currency: "INR",
    //         receipt: 'new id u want to impliment',
    //     })
    //     console.log("########## ")
    //     console.log("order >> ",order)
    //     res.json({data:order});
    // }

    //**********************************************************

    const razorpay = new Razorpay({
        key_id: "rzp_test_zVBhrL4CVfIezv",
        key_secret: "HeU66JXIWNBWFHC1vnC6qB7X",
    });

    const amount = 50000; // Amount in paise (100 paise = 1 INR)
    const currency = "INR";

    const order = await razorpay.orders.create({
        amount: amount,
        currency: currency,
        receipt: "order_12345", // Generate a unique order ID on your server
    });

    res.json({ order });
};

const oddersuccesspostend = (req, res) => {};

const checkphoneup = async (req, res) => {
    let number = req.body.number;
    console.log(number);

    user = await Userdb.find({ mobile: number })

        .then((data) => {
            if (!data) {
                let val = [
                    {
                        res: "",
                    },
                ];

                res.json(val);
            } else {
                console.log(data);
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
    if (user) {
        console.log(user);
    }
};

const orderStatus = async (req, res) => {
    odderId = req.query.id;
    let val = {
        v: 1,
    };
    let ret = false;
    let cancel = false;

    const orders = await Ordersdb.findById({ _id: odderId });
    if (orders.status == "delivered") {
        ret = true;
    }
    if (orders.status == "order confirmed" || orders.status == "shipped") {
        cancel = true;
    }

    const product = await Productdb.find({});

    res.render("orderStatus", { test: val, orders, product, ret, cancel });
};

//**************************** post api ****************************

//1
//create and save new user
const create = async (req, res) => {
    //validate request

    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }
    console.log(req.body.name)
    console.log(req.body.email)
    console.log(req.body.mobile)
    console.log(req.body.password)
 

    const dash = await Dashdb.findOneAndUpdate({});
    dash.user += 1;
    dash.save();
    //new user
    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        isVerified: true,
        isAdmin: false,
    });

    //save user in the database
    user.save(user)
        .then((data) => {
            res.json(data)
            // res.redirect("/login");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error",
            });
        });
};

//2.
//product find
const productfind = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        Productdb.findById(id)
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    res.send(data);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
    } else {
        Productdb.find({ isAvailable: true })
            .then((products) => {
                res.send(products);
            })
            .catch((err) => {
                res.status(500).send({ message: err.message || "error occered" });
            });
    }
};

//3.
const productsearch = (req, res) => {
    const value = req.body.va;

    Productdb.find({ name: { $regex: value, $options: "i" } })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

//4.
const sortfind = (req, res) => {
    const value = req.body.va;
    Productdb.find({})
        .sort({ price: value })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

//5.
const filterfind = (req, res) => {
    const value = req.body;
    axios
        .get("http://localhost:3000/user/filter/product", { params: { value } })

        .then((response) => {
            res.json(response.data);
        })
        .catch((err) => {
            res.send(err);
        });
};

//6
const poductpagin = async (req, res) => {
    const values = req.body.svalue;
    const valuel = req.body.lvalue;

    await Productdb.find({})
        .skip(values)
        .limit(valuel)

        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

//************************ end ********* end ***********************

//1.
const filterfindcategory = (req, res) => {
    console.log("filterfindcategory" + req.query.value);
    axios
        .get("http://localhost:3000/user/check/product")
        .then((response) => {
            console.log(response.data);
            res.render("cart");
        })
        .catch((err) => {
            res.send(err);
        });
};

//2.
const productfilter = (req, res) => {
    const value = req.query.value;
    Productdb.find({ category: { $in: value } })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

//3
const sortfilter = (req, res) => {
    const value = req.query.value;
    Productdb.find({})
        .sort({ price: value })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

const couponCodeCheck = async (req, res) => {
    if (req.session.isAvailable) {
        let couponcode = req.body.coupon;

        const couponck = await Coupon.findOne({ code: couponcode });
        if (couponck.count <= 1) {
            return;
        }
        let percent = couponck.percent;
        let maxoff = couponck.maxoff;

        const sess = req.session.isAvailable;
        let val = {
            v: 1,
        };
        let user = {};

        // let arr = [];

        let pro = [];
        let coupon = [];

        let userad = {};

        let flultotal = 0;

        user = await Userdb.findByIdAndUpdate({ _id: req.session.isAvailable });

        const value = user.cart.item.map((val) => val.productId);

        const fultot = user.cart.item.map((val) => {
            const res = val.qty * val.price;
            return res;
        });

        flultotal = fultot.reduce((tot, val) => {
            return tot + val;
        }, 0);

        if (flultotal) {
            let prc = (percent * flultotal) / 100;
            if (maxoff > prc) {
                flultotal = flultotal - maxoff;
                // console.log(flultotal + "ans1");
            } else {
                flultotal = flultotal - prc;
                // await user.save()
            }

            user.cart.totalPrice = flultotal;
            user.save();
        }

        // await user.save()

        pro = await Productdb.find({ _id: { $in: value } });

        const id = req.session.isAvailable;
        userad = await Adressdb.find({ userId: id });

        // coupon = await Coupon.find({});
        couponck.usedBy.push(sess);
        couponck.count -= 1;
        await couponck.save();
    } else {
        res.redirect("/login");
    }
};

const return_reason = async (req, res) => {
    let Orders = await Ordersdb.findByIdAndUpdate({ _id: req.body.id });

    Orders.reason = req.body.value;
    Orders.status = "returned";
    Orders.save();
    if (Orders.reason != "product damage") {
        Orders.products.item.map(async (item) => {
            let prid = item.productId;
            let prqty = item.qty;
            const product = await Productdb.findByIdAndUpdate({ _id: prid });
            product.stock += prqty;
            product.save();
        });
    }
    const dash = await Dashdb.findOneAndUpdate({});
    dash.return += 1;
    dash.save();
    res.json(Orders);
};

const addressChange = async (req, res) => {
    let val = {
        v: 1,
    };
    console.log(req.query.id);
    const adress = await Adressdb.findById({ _id: req.query.id });
    console.log(adress);

    res.render("addressChange", { test: val, adress });
};

const adress_update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }
    const id = req.params.id;
    try {
        const datares = await Adressdb.findByIdAndUpdate(id, req.body, { new: true });
        if (!datares) {
            res.status(404).send({ message: "user not found" });
        } else {
            console.log(datares);
            res.send(datares);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "error update user information" });
    }
};

const odder_cancel = async (req, res) => {
    console.log("start..............................");
    console.log(req.body.id);
    let Orders = await Ordersdb.findByIdAndUpdate({ _id: req.body.id });
    Orders.status = "cancel";
    console.log(Orders);
    Orders.save();
    console.log(Orders);
    res.json(Orders);
};

module.exports = {
    home,
    cart,
    login,
    productfind,
    product,
    single_product,
    wishlist,
    create,
    // isLogin,
    logout,
    // addAddress,
    signin,
    register,
    forgotnumber,
    newpassword,
    checknumber,
    otppage,
    generate,
    otppost,
    passwordchange,
    filterfind,
    productfilter,
    filterfindcategory,
    sortfind,
    sortfilter,
    productsearch,
    dashboard,
    // addcart,
    addcartput,
    addwishlistput,
    dashboardpost,
    poductpagin,
    checkout,
    cartupdat,
    cartremove,
    wishlistremove,
    oddersuccess,
    oddersuccesspost,
    checkphoneup,
    orderStatus,
    oddersuccesspostend,
    couponCodeCheck,
    return_reason,
    addressChange,
    adress_update,
    odder_cancel,
};
