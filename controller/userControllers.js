const axios = require("axios");
const Userdb = require("../models/userModel");
const Productdb = require("../models/productModel");
const Adressdb = require("../models/addressModel");
const Ordersdb = require("../models/ordersModel")

//1
const home = async (req, res) => {
    if (req.session.isAvailable) {
        const id = req.session.isAvailable;
        console.log(id + "...............");
        const value = await Userdb.find({ _id: id });
        console.log(value);
        let val = {
            v: 1,
        };

        axios
            .get("http://localhost:3000/user/check/product")
            .then((response) => {
                res.render("home", { products: response.data, details: value, test: val });
            })
            .catch((err) => {
                res.send(err);
            });
    } else {
        let val = {
            v: 0,
        };

        axios
            .get("http://localhost:3000/user/check/product")

            .then((response) => {
                res.render("home", { products: response.data, test: val });
            })
            .catch((err) => {
                res.send(err);
            });
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
const product = (req, res) => {
    let val = {
        v: 0,
    };
    axios
        .get("http://localhost:3000/check/product")
        .then((response) => {
            console.log("end");
            res.render("product", { products: response.data, test: val });
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
        // console.log(pro + "...........pro");
        // console.log(val + "...........val");
        // console.log(sess + "...........sess");
        // console.log(user + "...........user");
        // console.log(flultotal + "...........flultotal");

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
        console.log(value);

        res.render("dashboard", { products: user, details: value, test: val });
    } else {
        res.redirect("/login");
    }
};

//11
const forgotnumber = (req, res) => {
    let val = {
        v: 0,
    };

    res.render("forgot-number", { user: 0,test: val });
};

//12
const newpassword = (req, res) => {
    let val = {
        v: 0,
    };
    res.render("newpassword",{test: val});
};

//13
const checknumber = async (req, res) => {
    const data = {
        mobile: req.body.mobile,
    };

    try {
        const check = await Userdb.findOne({ mobile: req.body.mobile });

        if (check.mobile == data.mobile) {
            console.log(check);
            req.session.val = check._id;
            console.log(req.session.val + "req.session.id");
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
    // console.log(req.session.myValue)
    const result = req.body.first + req.body.second + req.body.third + req.body.fourth;
    console.log(result);
    if (req.session.myValue == result) {
        req.session.myValue = "";
        console.log(req.session.val + "............");
        res.redirect("/newpassword");
    } else {
        req.session.myValue = "";
        res.redirect("/otppage");
    }
};

//17
const passwordchange = async (req, res) => {
    console.log(req.body.password1);
    const pass = req.body.password1;

    console.log(req.body.password2);
    const value = req.session.val;
    const user = await Userdb.findByIdAndUpdate({ _id: value }, { $set: { password: pass } });
    console.log(user + "............+++++");
    await user.save();
    res.redirect("/login");
};

//18
//****************** addcart ******************//
// const addcart = (req, res) => {
//     console.log("start")
//     if (req.session.isAvailable) {
//         console.log(req.session.isAvailable)
//         console.log(req.query.id)
//         console.log(req.query.price)
//         axios
//         .put("http://localhost:3000/addcart",{ params: { id: 10} })
//         .then((response) => {
//             res.render("cart");
//         })
//         .catch((err) => {
//             res.send(err);
//         });
//     } else {
//         res.render("login");
//     }
// };
//****************** addcart ******************//

//18
const addcartput = async (req, res) => {
    // console.log("2");
    if (req.session.isAvailable) {
        
        const id = req.session.isAvailable;
    
        const productId = req.body.id;
        
        const price = req.body.price;
        

        const singletotal = req.body.price;
        console.log(price + "isAvailable");

        const qty = 1;

        const user = await Userdb.findByIdAndUpdate(id);
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        console.log(user);

        user.cart.item.push({ productId, qty, price, singletotal });
        user.cart.totalPrice += price * qty;
        await user.save();
    } else {
        res.render("login");
    }
};

//19
const addwishlistput = async (req, res) => {
    console.log("2");
    if (req.session.isAvailable) {
        console.log("3");
        const id = req.session.isAvailable;
        console.log(id + "id");

        const productId = req.body.id;
        console.log(productId + "productId");

        const price = req.body.price;
        console.log(price + "isAvailable");

        const qty = 1;
        //    const price = 2500

        // const id = req.params.id;
        // Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })

        const user = await Userdb.findByIdAndUpdate(id);
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        console.log(user);

        user.wishlist.item.push({ productId, price });

        await user.save();
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
        console.log(req.session.isAvailable + "isAvailable");
        console.log(req.body.name + "fullname");
        console.log(req.body.number + "number");
        console.log(req.body.pincode + "pincode");
        console.log(req.body.state + "state");
        console.log(req.body.city + "city");
        console.log(req.body.house + "house");
        console.log(req.body.road + "road");

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


        // const value = await Userdb.find({ _id: id });

        // res.render("dashboard", { products: user, details: value, test: val });


        // res.render("cart", { products: pro, test: val, sessval: sess, userdt: user, total: flultotal });

        res.render("checkout", { test: val, productad: userad ,products: pro, sessval: sess ,userdt: user, total: flultotal});

    } else {
        res.redirect("/login");
    }
};

const cartupdat = async (req, res) => {
    const idvalue = req.body.idvalues;
    const sessvalue = req.body.sessvalues;
    const changenum = req.body.change;
    console.log(changenum + "changenum");

    const user = await Userdb.findByIdAndUpdate({ _id: sessvalue });

    const index = user.cart.item.indexOf(
        user.cart.item.find((val) => {
            return val.productId == idvalue;
        })
    );

    console.log(index);
    if (changenum == 1) {
        const quantity = user.cart.item[index].qty;

        console.log(index + "in");

        user.cart.item[index].qty++;
        await user.save()
        let valp = user.cart.item[index].price
        let valq = user.cart.item[index].qty
        user.cart.item[index].singletotal = valp*valq
        await user.save()

        

        // const prid = user.cart.item[index].productId

        // const product = await Productdb.findByIdAndUpdate({ _id: prid });

        // product.stock--

        // await product.save();

        // console.log(product)
    } else {
        const quantity = user.cart.item[index].qty;

        user.cart.item[index].qty--;

        await user.save()

        let valp = user.cart.item[index].price
        let valq = user.cart.item[index].qty
        user.cart.item[index].singletotal = valp*valq
        await user.save()

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
                console.log("4");
                console.log(data);
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

    console.log(index);

    user.cart.item.splice(index, 1);

    await user.save();

    Userdb.findByIdAndUpdate({ _id: sessvalue })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                console.log(data);
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

    console.log(index);

    user.wishlist.item.splice(index, 1);

    await user.save();

    Userdb.findByIdAndUpdate({ _id: sessvalue })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                console.log(data);
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

// ...........................

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

// ...........................
 
        const id = req.session.isAvailable;
         userad = await Adressdb.find({ userId: id });

        user = await Userdb.findById({ _id: req.session.isAvailable });



        res.render("oddersuccess", { test: val, productad: userad ,products: pro, sessval: sess ,userdt: user, total: flultotal});

    } else {
        res.redirect("/login");
    }

   
};




const oddersuccesspost = async (req, res, next) => {


   
   const addressid = req.body.addresid
   console.log(req.body.addresid +"req.body.addresid 1") 
   const paymentmethode = req.body.payment
   console.log(paymentmethode +"req.body.paymentmethode 1111") 
   const userid = req.session.isAvailable
   console.log(userid+"userid...............2")


 const user = await Userdb.findById({ _id: req.session.isAvailable });
 console.log(user+"user...............3")

   const value = user.cart.item.map(async (val,i) =>{

        let prid = val.productId
        console.log(prid+"prid...............4")
        

        const product = await Productdb.findById({ _id: prid })
        console.log(product+"product...............5")

        let prs = product.stock 
        console.log(prs+"prs...............6")

        let pri = val.qty
        console.log(pri+"pri...............7")

        product.stock = prs - pri
        product.save()

   });


   const Adress = await Adressdb.findById({ _id: addressid });
//    console.log(Adress+"Adress............")
//    const pay = req.body.payment
//    const name = Adress.fullname
//    const phone = Adress.phone1
//    const pin = Adress.pincode
//    const sta = Adress.state
//    const ci = Adress.city
//    const hno = Adress.houseNo
//    const rna = Adress.roadName

//    console.log(`userid=${userid}, pay=${pay}, name=${name}, phone=${phone}, pin=${pin}, sta=${sta}, ci=${ci}, hno=${hno}, rna=${rna} `)
//    console.log(req+"req.body")



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
    status: true,
    productReturned: 0,

});

//save Orders in the database
Orders.save(user)
    .then((data) => {
        console.log("sucess")
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message || "some error",
        });
    });

    
    user.cart.item.map(async (val,i) =>{

        let productId = val.productId
        let qty = val.qty
        let price = val.price

        Orders.products.item.push({productId ,qty ,price })
   });

res.redirect("/oddersuccess")



};





//**************************** post api ****************************

//1
//create and save new user
const create = (req, res) => {
    //validate request
    // console.log(req.body);
    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }
    console.log("end");

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
            res.redirect("/login");
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
        Productdb.find()
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
                console.log("4");
                console.log(data);
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

//4.
const sortfind = (req, res) => {
    console.log("3....", req.body.va);
    const value = req.body.va;

    Productdb.find({})
        .sort({ price: value })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                console.log("4");
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
    console.log("value:........" + value);
    axios
        .get("http://localhost:3000/user/filter/product", { params: { value } })

        .then((response) => {
            console.log("res" + response.data);
            res.json(response.data);
        })
        .catch((err) => {
            res.send(err);
        });
};

//6
const poductpagin = async (req, res) => {
    // console.log("s....", req.body.svalue);
    const values = req.body.svalue;

    // console.log("l....", req.body.lvalue);
    const valuel = req.body.lvalue;

    await Productdb.find({})
        .skip(values)
        .limit(valuel)

        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                console.log(data);
                res.json(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
};

// block_user_find
// const addAddress = (req, res) => {
//     try {
//     } catch (error) {}
// };
// const isLogin = (req, res, next) => {
//     try {
//         if (req.session.user) {
//             res.render("home");
//         } else {
//             next();
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };

// const category = (req, res) => {
//     res.render("category");
// };

// const sortfind = async (req, res) => {
//     console.log("3....")
//     const value = req.body
//     console.log("value:"+req.body)
//     // const value = req.query.value;
//   await  Productdb.find({}).sort({price:value})
//         .then((data) => {
//             if (!data) {
//                 res.status(404).send({ message: "Not found user with id" });
//             } else {
//                 console.log("4....")
//                 console.log("....."+data)
//                 res.json(data)
//             }
//         })
//         .catch((err) => {
//             res.status(500).send({ message: "Error retriving user with id" });
//         });
// // res.render("newpassword");
// };

//************************ end ********* end ************************

//1.
const filterfindcategory = (req, res) => {
    console.log("filterfindcategory" + req.query.value);
    axios
        .get("http://localhost:3000/user/check/product")
        .then((response) => {
            console.log(response.data);
            res.render("cart");
            // res.render("product",{ products: response.data })
        })
        .catch((err) => {
            res.send(err);
        });
};

//2.
const productfilter = (req, res) => {
    // console.log("in id")
    const value = req.query.value;
    console.log("params===" + value);
    Productdb.find({ category: { $in: value } })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                // console.log("....."+data)
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });

    // res.render("register");
};

//3
const sortfilter = (req, res) => {
    // console.log("in id")
    const value = req.query.value;
    console.log("params===" + value);
    Productdb.find({})
        .sort({ price: value })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "Not found user with id" });
            } else {
                // console.log("....."+data)
                console.log("4");
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retriving user with id" });
        });
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
    oddersuccesspost
};

// .get("http://localhost:3000/user/filter/product",{ params: {value:req.query.value} })
