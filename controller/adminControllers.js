const axios = require("axios");

const Userdb = require("../models/userModel");

const Productdb = require("../models/productModel");

const Categorydb = require("../models/categoryModel");

const ordersdb = require("../models/ordersModel");

const Coupondb = require("../models/couponModel");

const Offerdb = require("../models/offerModel");

const Dashdb = require("../models/dashModel");

//1
const adminLogin = (req, res) => {
    res.render("login");
};

//2.1
const index = (req, res) => {
    axios
        .get("http://localhost:3000/admin/users")

        .then((response) => {
            res.render("index", { users: response.data });
        })
        .catch((err) => {
            res.send(err);
        });
};

const dashboard = async (req, res) => {
    const dash = await Dashdb.find();
    console.log(dash);
    res.render("dashboard", { dash });
};

//2.2
const find = (req, res) => {
    console.log("2");
    Userdb.find()
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || "error occered" });
        });
};

//3.1
const product = (req, res) => {
    console.log("1");
    axios
        .get("http://localhost:3000/admin/check/product")
        .then((response) => {
            console.log("end");
            res.render("product", { products: response.data });
        })
        .catch((err) => {
            res.send(err);
        });
};

//3.2 and 5
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

//4.1
const product_add = (req, res) => {
    axios
        .get("http://localhost:3000/admin/add/category")
        .then((response) => {
            res.render("product-add", { data: response.data });
        })
        .catch((err) => {
            res.send(err);
        });
};

//4.2
const cartfind = (req, res) => {
    Categorydb.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || "error occered" });
        });
};

//5
const update_products = async (req, res) => {
    const category = await Categorydb.find({});

    axios
        .get("http://localhost:3000/admin/check/product", { params: { id: req.query.id } })

        .then(function (userdata) {
            res.render("product-edit", { user: userdata.data, category });
        })
        .catch((err) => {
            res.send(err);
        });
};

//6
const category = (req, res) => {
    axios
        .get("http://localhost:3000/admin/check/category")

        .then((response) => {
            res.render("category", { category: response.data });
        })
        .catch((err) => {
            res.send(err);
        });
};

const categoryfind = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        Categorydb.findById(id)
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
        Categorydb.find()
            .then((category) => {
                res.send(category);
            })
            .catch((err) => {
                res.status(500).send({ message: err.message || "error occered" });
            });
    }
};

const addCategory = (req, res) => {
    res.render("addCategory");
};

const editCategory = async (req, res) => {
    const category = await Categorydb.find({});
    console.log(category + "category............");

    res.render("category-edit", { category });
};

//post api 1
const product_add_post = async (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }

    const Product = await Productdb.find({ name: req.body.name});

    if(Product && Product[0]?.name != null){
        res.redirect("/admin/product-add");
    }else{

    //new product
    const images = req.files;
    const product = new Productdb({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        isAvailable: true,
        image: images.map((x) => x.filename),
    });
    product
        .save(product)
        .then((data) => {
            res.redirect("/admin/product-add");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error",
            });
        });

    }
};

//post api 2
const categorypost = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }

    const Category = await Categorydb.find({ name: req.body.name});

    if(Category && Category[0]?.name != null){
        res.redirect("/admin/product");
    }else{
        
    //new product
    const category = new Categorydb({
        name: req.body.name,
        description: req.body.description,
    });

    //save product in the database
    category
        .save(category)
        .then((data) => {
            res.redirect("/admin/product");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error",
            });
        });

    }
};

//post api 3
const product_edit = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "user not found" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error update user information" });
        });
};

const block_user = async (req, res) => {
    try {
        const id = req.query.id;

        const userData = await Userdb.findById({ _id: id });

        if (userData.isVerified === true) {
            await Userdb.findByIdAndUpdate({ _id: id }, { $set: { isVerified: false } });
        } else {
            await Userdb.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } });
        }

        res.redirect("/admin");
    } catch (err) {
        console.log(err);
    }
};

//Update a new identified product by product id
const product_update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }

    const id = req.params.id;
    console.log(req.body)
    Productdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "user not found" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error update user information" });
        });
};

//Update a new identified category by category id
const category_update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }

    const id = req.params.id;
    Categorydb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "user not found" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error update user information" });
        });
};

const coupon_update = async (req, res) => {
    console.log("1");
    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }
    console.log("2");
    const id = req.params.id;
    console.log(id + "1");
    await Coupondb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "user not found" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error update user information" });
        });
};

const offer_update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }

    const id = req.params.id;

    await Offerdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "user not found" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error update user information" });
        });
};

const eidt_category = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }

    const id = req.params.id;
    Categorydb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "user not found" });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error update user information" });
        });
};

const editcategoryupdate = async (req, res) => {
    const values = req.query.id;

    const category = await Categorydb.findById(values);
    console.log(category + "category.....");
    res.render("category-edit-save", { category });
};

// *************************    *************************//
const order_details = async (req, res) => {
    let arr = [];

    //   const value = req.query.id
    //  const category = await Categorydb.findById(value)
    //  console.log(category+"category.....")
    //  res.render("category-edit-save",{category})

    const orders = await ordersdb.find({});

    // console.log(orders+"orders")

    // const value = orders.map(async (val,i) =>{

    //     let prid = val.userId
    //     arr.push(prid)

    // });
    // console.log(arr+"product...............5")

    // const User = await Userdb.find({ _id:{ $in : arr }})

    // console.log(User+"Userdb")
    const product = await Productdb.find({});

    res.render("order", { orders, product });
};

// *************************    *************************//

const status_change = async (req, res) => {
    const odstatus = req.body.value;

    const idnum = req.body.idvalue;

    const orders = await ordersdb.findByIdAndUpdate({ _id: idnum }, { status: odstatus });

    await orders.save();

    console.log(req.body.value);
    res.json(orders);
};

const coupon_get = async (req, res) => {
    const coupon = await Coupondb.find({});
    res.render("coupon", { category: coupon });
};

const addCoupon = (req, res) => {
    res.render("coupon-add");
};

const addCouponPost = async (req, res) => {
    // const user = new Adressdb
    const Coupon = await Coupondb.find({ name: req.body.name});
    if(Coupon && Coupon[0]?.name != null){
        res.redirect("/admin/coupon")

    }else{
    const coupond = new Coupondb({
        name: req.body.name,
        code: req.body.code,
        percent: req.body.percentage,
        maxoff: req.body.maxoff,
        expdt: req.body.expdt,
        count: req.body.count,
        avilable: true,
    });
    coupond
        .save(coupond)
        .then((data) => {
            // alert("update succesfully")
            res.render("coupon-add");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error",
            });
        });
    }
    
};

const editCoupon = async (req, res) => {
    const value = req.query.id;

    const coupon = await Coupondb.findById({ _id: value });
    console.log(coupon + "coupon");

    res.render("coupon-edit", { coupon });
};

const offer_get = async (req, res) => {
    const offerdb = await Offerdb.find({});
    res.render("offer", { category: offerdb });
};

const addOfferPost = async (req, res) => {

    const Offer = await Offerdb.find({ name: req.body.name});

    if(Offer && Offer[0]?.name != null){
        res.render("offer-add");
    }else{
    // const user = new Adressdb
    const offer = new Offerdb({
        name: req.body.name,
        discount: req.body.discount,
        categoryname: req.body.categoryname,
        productname: req.body.productname,
        expirydate: req.body.expirydate,
        count: req.body.count,
        avilable: true,
    });
    offer
        .save(offer)
        .then(async (data) => {
            const prd = await Productdb.find({ category: req.body.categoryname });
            const fultot = prd.map((val) => {
                const res = val.price;

                const res2 = (res * req.body.discount) / 100;
                val.price = val.price - res2;
                // prd.save(val.price)
            });
            res.render("offer-add");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error",
            });
        });

    }
};

const addOffer = async (req, res) => {
    res.render("offer-add");
};

const editOffer = async (req, res) => {
    const value = req.query.id;
    const offer = await Offerdb.findById({ _id: value });
    res.render("offer-edit", { offer });
};

// offer_update

const block_products = async (req, res) => {
    const id = req.query.id;
    const userData = await Productdb.findById({ _id: id });
    console.log(userData);
    if (userData.isAvailable === true) {
        await Productdb.findByIdAndUpdate({ _id: userData._id }, { $set: { isAvailable: false } });
    } else {
        await Productdb.findByIdAndUpdate({ _id: userData._id }, { $set: { isAvailable: true } });
    }

    res.redirect("/admin/product");
};

const block_offer = async (req, res) => {
    const id = req.query.id;
    console.log(id);

    const coupondb = await Offerdb.findById({ _id: id });
    console.log(coupondb.avilable);

    if (coupondb.avilable) {
        await Offerdb.findByIdAndUpdate({ _id: coupondb._id }, { $set: { avilable: false } });
    } else {
        await Offerdb.findByIdAndUpdate({ _id: coupondb._id }, { $set: { avilable: true } });
    }

    res.redirect("/admin/offer");
};

const block_coupon = async (req, res) => {
    const id = req.query.id;
    console.log(id);

    const coupondb = await Coupondb.findById({ _id: id });
    console.log(coupondb.avilable);

    if (coupondb.avilable) {
        await Offerdb.findByIdAndUpdate({ _id: coupondb._id }, { $set: { avilable: false } });
    } else {
        await Offerdb.findByIdAndUpdate({ _id: coupondb._id }, { $set: { avilable: true } });
    }

    res.redirect("/admin/coupon");
};


const graph_data = async (req, res) => {
    // const orders = await ordersdb.find({});
    // const orderDates = await ordersdb.find().distinct('createdAt');
    // console.log(orderDates)

    

    if(req.query.id === "full"){
        
        const orderdata = await ordersdb.find();

        console.log("in fetchSales",orderdata);
        const totalDelivery = orderdata.filter(data=>data.status==="delivered")
        const totalCancelled = orderdata.filter(data=>data.status==="cancell");
        const totalReturn = orderdata.filter(data=>data.status==="returned");
        const chartdata = [
            { label: 'Delivered', value:totalDelivery.length  },
            { label: 'cancel', value: totalCancelled.length },
            { label: 'returned', value: totalReturn.length }

          ];
        res.json(chartdata);
    }
};

module.exports = {
    index,
    adminLogin,
    find,
    product_add,
    productfind,
    product_add_post,
    product,
    addCategory,
    categorypost,
    cartfind,
    product_edit,
    update_products,
    editCategory,
    category,
    categoryfind,
    product_update,
    category_update,
    block_user,
    editcategoryupdate,
    eidt_category,
    order_details,
    status_change,
    coupon_get,
    addCoupon,
    addCouponPost,
    editCoupon,
    coupon_update,
    offer_get,
    addOfferPost,
    addOffer,
    editOffer,
    offer_update,
    block_products,
    block_offer,
    block_coupon,
    dashboard,
    graph_data
};
