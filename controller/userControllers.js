const axios = require("axios");
const Userdb = require("../models/userModel");
const Productdb = require("../models/productModel");
const Adressdb = require("../models/addressModel");
const Ordersdb = require("../models/ordersModel");
const Offer = require("../models/offerModel");
const Coupon = require("../models/couponModel");
const Dashdb = require("../models/dashModel");
const Salesdb = require("../models/salesReport");
const Razorpay = require("razorpay");

//1

const home = async (req, res) => {
    try {
    const offerhf = await Offer.findOne({ name: "HEADPHONE" });
    const offersp = await Offer.findOne({ name: "SPEAKER" });

    const productwa = await Productdb.find({ category: "WATCH", isAvailable: true });
    const producthe = await Productdb.find({ category: "HEADPHONE", isAvailable: true });
    const productsp = await Productdb.find({ category: "SPEAKER", isAvailable: true });

    const products = await Productdb.find();
    console.log(products,"====products");

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

        let Totalwish = user.wishlist.item.length;
        let Totalcart = user.cart.item.length;

        const cart = user.cart.item.map((val) => val.productId);
        procart = await Productdb.find({ _id: { $in: cart } });

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
            Totalcart,
            Totalwish,
        });
    } else {
        let val = {
            v: 0,
        };

        res.render("home", {
            productwa,
            producthe,
            productsp,
            products,
            test: val,
            offerhf,
            offersp,
            prowish,
            procart,
        });
    }
    } catch (error) {
        console.log(error);
        
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
    try {
        const data = {
            email: req.body.email,
            password: req.body.password,
        };
        const check = await Userdb.findOne({ email: req.body.email });

        if (check.email == data.email && check.password == data.password) {
            req.session.isAvailable = check._id;
            if (check.isVerified == true) {
                res.json({ loginNext: true });
            } else {
                res.json({ loginNext: "block" });
            }
        } else {
            res.json({ loginNext: "block" });
        }
    } catch (error) {
        res.json({ loginNext: false });
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
    if (req.session.isAvailable) {
        let val = {
            v: 1,
        };

        let user = await Userdb.findById({ _id: req.session.isAvailable });
        let Totalwish = user.wishlist.item.length;
        let Totalcart = user.cart.item.length;

        const producttop = await Productdb.find();

        const data = await Productdb.find({ isAvailable: true });
        res.render("product", { producttop, products: data, test: val, Totalwish, Totalcart });
    } else {
        let val = {
            v: 0,
        };

        const producttop = await Productdb.find();

        const data = await Productdb.find({ isAvailable: true });
        res.render("product", { producttop, products: data, test: val });
    }
};

//7
const single_product = async (req, res) => {
    if (req.session.isAvailable) {
        let val = {
            v: 1,
        };
        let id = req.query.id;

        const data = await Productdb.findById(id);
        const productPic = data.image;
        let user = await Userdb.findById({ _id: req.session.isAvailable });
        let Totalwish = user.wishlist.item.length;
        let Totalcart = user.cart.item.length;
        res.render("single-product", { user: data, productPic, test: val, Totalwish, Totalcart });
    } else {
        let val = {
            v: 0,
        };
        let id = req.query.id;

        const data = await Productdb.findById(id);
        const productPic = data.image;
        res.render("single-product", { user: data, productPic, test: val });
    }
};

//8
const wishlist = async (req, res) => {
    let val = {
        v: 1,
    };

    let arr = [];

    let pro = [];

    let user = {};

    const sess = req.session.isAvailable;

    user = await Userdb.findById({ _id: req.session.isAvailable });

    const value = user.wishlist.item.map((val) => val.productId);

    pro = await Productdb.find({ _id: { $in: value } });

    let Totalwish = user.wishlist.item.length;
    let Totalcart = user.cart.item.length;

    res.render("wishlist", { products: pro, test: val, sessval: sess, userdt: user, Totalcart, Totalwish });
};

//9
const cart = async (req, res) => {
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

    let Totalwish = user.wishlist.item.length;
    let Totalcart = user.cart.item.length;

    res.render("cart", { products: pro, test: val, sessval: sess, userdt: user, total: flultotal, Totalwish, Totalcart });
};

//10
const dashboard = async (req, res) => {
    let val = {
        v: 1,
    };
    const id = req.session.isAvailable;
    const user = await Adressdb.find({ userId: id });
    let value = await Userdb.find({ _id: id });

    const orders = await Ordersdb.find({ userId: id });
    const product = await Productdb.find({});

    let Totalwish = value[0].wishlist.item.length;
    let Totalcart = value[0].cart.item.length;
    res.render("dashboard", { products: user, details: value, test: val, orders, product, Totalwish, Totalcart });
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
    try {
        const data = {
            mobile: req.body.mobile,
        };

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

        res.json({ alredycart: 0 });
    } else {
        res.json({ alredycart: 1 });
    }
};

const addwishlistput = async (req, res) => {
    const id = req.session.isAvailable;
    const productId = req.body.id;
    const price = req.body.price;
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

        res.json({ alredycart: 0 });
    } else {
        res.json({ alredycart: 1 });
    }
};

//20

const dashboardpost = (req, res) => {
    //validate request

    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }

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
};

//15
const checkout = async (req, res) => {
    const sess = req.session.isAvailable;
    let val = {
        v: 1,
    };
    let user = {};

    let pro = [];
    let coupon = [];

    let userad = {};

    let flultotal = 0;

    user = await Userdb.findById({ _id: req.session.isAvailable });

    const value = user.cart.item.map((val) => val.productId);

    const fultot = user.cart.item.map(async (valus) => {
        const res = valus.qty * valus.price;
        return res;
    });

    pro = await Productdb.find({ _id: { $in: value } });

    const id = req.session.isAvailable;
    userad = await Adressdb.find({ userId: id });
    coupon = await Coupon.find({ usedBy: { $nin: [sess] } });

    let Totalwish = user.wishlist.item.length;
    let Totalcart = user.cart.item.length;

    res.render("checkout", {
        test: val,
        productad: userad,
        products: pro,
        sessval: sess,
        userdt: user,
        total: flultotal,
        coupon,
        Totalwish,
        Totalcart,
    });
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
    const sess = req.session.isAvailable;
    const addressid = req.session.addressid 
    let val = {
        v: 1,
    };

    let user = {};

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
    userad = await Adressdb.find({ _id: addressid });

    user = await Userdb.findById({ _id: req.session.isAvailable });
    let Totalwish = user.wishlist.item.length;
    let Totalcart = user.cart.item.length;

    res.render("oddersuccess", {
        test: val,
        productad: userad,
        products: pro,
        sessval: sess,
        userdt: user,
        total: flultotal,
        Totalwish,
        Totalcart
    });
}; 

const odder_success_Check = async (req, res) => {
    let odderPost = true;

    const user = await Userdb.findById({ _id: req.session.isAvailable });

    let userCartLength = user.cart.item.length - 1;
    console.log(userCartLength, "userCartLength");

    const value = user.cart.item.map(async (val, i) => {
        let prid = val.productId;

        const product = await Productdb.findById({ _id: prid });

        let prs = product.stock;

        let pri = val.qty;

        if (prs - pri <= 0) {
            odderPost = false;
            res.json({ odderNext: odderPost });
        }
        if (userCartLength == i && odderPost !== false) {
            res.json({ odderNext: odderPost });
        }
    });
};

const oddersuccesspost = async (req, res) => {
    const addressid = req.body.addresid;
    const paymentmethode = req.body.payment;
    req.session.addressid = addressid;
    let total;
    console.log(addressid);
    console.log(paymentmethode);
    if (1 == 1) {
        const userid = req.session.isAvailable;
        const user = await Userdb.findById({ _id: req.session.isAvailable });
        const value = user.cart.item.map(async (val, i) => {
            let prid = val.productId;

            const product = await Productdb.findById({ _id: prid });

            let prs = product.stock;

            let pri = val.qty;

            product.stock = prs - pri;
            product.save();
        });
        // Salesdb
        user.cart.item.map(async (val, i) => {
            let prid = val.productId;

            const product = await Productdb.findById({ _id: prid });

            let prs = product.stock;

            let pri = val.qty;

            const Sales = new Salesdb({
                productNames: product.name,
                category: product.category,
                quantity: val.qty,
                amount: val.singletotal,
            });

            //save Orders in the database
            Sales.save(user)
                .then((data) => {})
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "some error",
                    });
                });
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

        total = Orders.products.item.reduce((tot, val) => {
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

    if (paymentmethode == "Cash on delivery") {
        console.log("cash on delivery...........................");
        res.json({ payment: "Cash on delivery" });
    } else {
        console.log("razor pay ..........................");
        const razorpay = new Razorpay({
            key_id: "rzp_test_zVBhrL4CVfIezv",
            key_secret: "HeU66JXIWNBWFHC1vnC6qB7X",
        });
        let toralPrice = total * 100;
        // let toralPrice = toralPr.toString();

        const amount = toralPrice; // Amount in paise (100 paise = 1 INR)
        const currency = "INR";
        console.log(amount, "amount=======");

        const order = await razorpay.orders.create({
            amount: amount,
            currency: currency,
            receipt: "order_12345", // Generate a unique order ID on your server
        });

        res.json({ order });
    }
};

const checkphoneup = async (req, res) => {
    let number = req.body.number;

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
    let user = await Userdb.findById({ _id: req.session.isAvailable });
    let Totalwish = user.wishlist.item.length;
    let Totalcart = user.cart.item.length;

    res.render("orderStatus", { test: val, orders, product, ret, cancel ,Totalwish ,Totalcart });
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
            res.json(data);
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
// copy.........
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

//4.category
const sortfind = (req, res) => {
    const value = req.body.va;
    const checkbox = req.body.checkbox;
    let { innerValue } = req.body;
    if (checkbox.length == 0) {
        Productdb.find()
            .sort({ price: value })
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    // let datalength = data.length;
                    // let lengthRes = Math.ceil(datalength/4);
                    // let nextpage = ++innerValue;
                    // let lenghtStart = (innerValue*4)-4;
                    // let lenghtEnd = lenghtStart + 4;
                    let nextpage = 1;
                    let lenghtStart = 0;
                    let lenghtEnd = 4;

                    let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
                    result.push(nextpage);
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
    } else {
        console.log(value, checkbox, "checkbox+++++");
        Productdb.find({ category: { $in: checkbox } })
            .sort({ price: value })
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    // console.log(data,"data========")
                    // res.json(data);
                    // let datalength = data.length;
                    // let lengthRes = Math.ceil(datalength/4);
                    // let nextpage = ++innerValue;
                    // let lenghtStart = (innerValue*4)-4;
                    // let lenghtEnd = lenghtStart + 4;
                    let nextpage = 1;
                    let lenghtStart = 0;
                    let lenghtEnd = 4;
                    let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
                    result.push(nextpage);
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
    }
};

//5.
const filterfind = async (req, res) => {
    console.log("filterfind===");
    const value = req.body;
    console.log(value, "filterfind===");
    // Productdb.find({ category: { $in: value } })
    if (value.length == 0) {
        const data = await Productdb.find();
        let nextpage = 1;
        let lenghtStart = 0;
        let lenghtEnd = 4;

        let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
        result.push(nextpage);
        res.json(result);
    } else {
        const data = await Productdb.find({ category: { $in: value } });
        let nextpage = 1;
        let lenghtStart = 0;
        let lenghtEnd = 4;

        let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
        result.push(nextpage);
        res.json(result);
    }


};

//6
const poductpagin = async (req, res) => {
    const values = req.body.svalue;
    const valuel = req.body.lvalue;
    let { sortValue, checkbox, innerValue } = req.body;
    console.log(sortValue, checkbox, innerValue);

    if (sortValue == null && checkbox.length == 0) {
        console.log("sortValue , checkbox,innerValue");
        Productdb.find()
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    let datalength = data.length;
                    let lengthRes = Math.ceil(datalength / 4);

                    let nextpage = innerValue;
                    let lenghtStart;
                    let lenghtEnd;
                    if (valuel == -1) {
                        if (innerValue > 1) {
                            nextpage = --innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    } else {
                        if (innerValue < lengthRes) {
                            nextpage = ++innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    }
                    let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
                    result.push(nextpage);
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
    } else if (sortValue !== null && checkbox.length == 0) {
        Productdb.find()
            .sort({ price: sortValue })
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    let datalength = data.length;
                    let lengthRes = Math.ceil(datalength / 4);

                    let nextpage = innerValue;
                    let lenghtStart;
                    let lenghtEnd;
                    if (valuel == -1) {
                        if (innerValue > 1) {
                            nextpage = --innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    } else {
                        if (innerValue < lengthRes) {
                            nextpage = ++innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    }
                    let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
                    result.push(nextpage);
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
    } else if (sortValue == null && checkbox.length > 0) {
        Productdb.find({ category: { $in: checkbox } })
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    let datalength = data.length;
                    let lengthRes = Math.ceil(datalength / 4);

                    let nextpage = innerValue;
                    let lenghtStart;
                    let lenghtEnd;
                    if (valuel == -1) {
                        if (innerValue > 1) {
                            nextpage = --innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    } else {
                        if (innerValue < lengthRes) {
                            nextpage = ++innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    }
                    let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
                    result.push(nextpage);
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
    } else if (sortValue !== null && checkbox.length > 0) {
        Productdb.find({ category: { $in: checkbox } })
            .sort({ price: sortValue })
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id" });
                } else {
                    let datalength = data.length;
                    let lengthRes = Math.ceil(datalength / 4);

                    let nextpage = innerValue;
                    let lenghtStart;
                    let lenghtEnd;
                    if (valuel == -1) {
                        if (innerValue > 1) {
                            nextpage = --innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    } else {
                        if (innerValue < lengthRes) {
                            nextpage = ++innerValue;
                        }
                        lenghtStart = innerValue * 4 - 4;
                        lenghtEnd = lenghtStart + 4;
                        console.log(lenghtStart, lenghtEnd);
                    }
                    let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
                    result.push(nextpage);
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "Error retriving user with id" });
            });
    } else {
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
    }
};

//************************ end ********* end ***********************

//1.
const filterfindcategory = (req, res) => {
    res.render("cart");

    // axios
    //     .get("http://localhost:3000/user/check/product")
    //     .then((response) => {
    //         console.log(response.data);
    //         res.render("cart");
    //     })
    //     .catch((err) => {
    //         res.send(err);
    //     });
};

//2.
// copy copy
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
        } else {
            flultotal = flultotal - prc;
        }

        user.cart.totalPrice = flultotal;
        user.save();
    }

    pro = await Productdb.find({ _id: { $in: value } });

    const id = req.session.isAvailable;
    userad = await Adressdb.find({ userId: id });

    // coupon = await Coupon.find({});
    couponck.usedBy.push(sess);
    couponck.count -= 1;
    await couponck.save();
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
    let user = await Userdb.findById({ _id: req.session.isAvailable });
    let Totalwish = user.wishlist.item.length;
    let Totalcart = user.cart.item.length;
    // console.log(adress);
    res.render("addressChange", { test: val, adress, Totalwish, Totalcart });
};

const adress_update = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.body) {
            return res.status(400).send({ message: "data to update can not be empty!" });
        }

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
    logout,
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
    couponCodeCheck,
    return_reason,
    addressChange,
    adress_update,
    odder_cancel,
    odder_success_Check,
    // sortfind_new,
    // filterfind_new,
    // poductpagin_new,
};
