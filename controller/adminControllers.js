const axios = require("axios");

const Userdb = require("../models/userModel");

const Productdb = require("../models/productModel");

const Categorydb = require("../models/categoryModel");

const ordersdb = require("../models/ordersModel");

const Coupondb = require("../models/couponModel");

const Offerdb = require("../models/offerModel");

const Dashdb = require("../models/dashModel");

const PDFDocument = require("pdfkit");

const Salesdb = require("../models/salesReport");

const fs = require("fs");

//1
const adminLogin = (req, res) => {
    res.render("login");
};

const signIn_post = async (req, res) => {
    
    try {
        console.log("inside post");
        const data = {
            email: req.body.email,
            password: req.body.password,
        };
        const check = await Userdb.findOne({ email: req.body.email });

        if (check.email == data.email && check.password == data.password && check.isAdmin == true) {
            req.session.isAvailable = check._id;
            console.log("inside post");
            res.redirect("/admin/")
        } else {
            res.redirect("/admin/")
        }
    } catch (error) {
        console.log(error)
        // res.json({ loginNext: false });
    }

};

//2.1
const index = async (req, res) => { 

    const data = await Userdb.find()
    res.render("index", { users: data });


};

const dashboard = async (req, res) => {
    const dash = await Dashdb.find();
    res.render("dashboard", { dash });
};

const logout = (req, res, next) => {
    try {
        req.session.destroy();
        res.redirect("/admin/");
    } catch (error) {
        console.log(error);
    }
};


//3.1
const product = async (req, res) => {
    const data = await Productdb.find();
    res.render("product", { products: data });
    
};


const poductpagin = async (req, res) => {
    let { nextValue, innerValue } = req.body;
    const data = await Productdb.find();

    let datalength = data.length;
    let lengthRes = Math.ceil(datalength / 5);

    let nextpage = innerValue;
                    let lenghtStart;
                    let lenghtEnd;
                    if (nextValue == -1) {
                        if (innerValue > 1) {
                            nextpage = --innerValue;
                        }
                        lenghtStart = innerValue * 5 - 5;
                        lenghtEnd = lenghtStart + 5;
                        console.log(lenghtStart, lenghtEnd);
                    } else {
                        if (innerValue < lengthRes) {
                            nextpage = ++innerValue;
                        }
                        lenghtStart = innerValue * 5 - 5;
                        lenghtEnd = lenghtStart + 5;
                        console.log(lenghtStart, lenghtEnd);
                    }
                    let result = data.filter((val, index) => index >= lenghtStart && index < lenghtEnd);
                    result.push(nextpage);
                    res.json(result);
    
};



//4.1
const product_add = async (req, res) => {

    const datas = await Categorydb.find()
    res.render("product-add", { data: datas });


};



//5
const update_products = async (req, res) => {
    const category = await Categorydb.find({});

let id = req.query.id

const data = await Productdb.findById(id)
res.render("product-edit", { user: data, category });


};

//6
const category = async (req, res) => {
    const data = await Categorydb.find({});
    res.render("category", { category: data });

};



const addCategory = (req, res) => {
    res.render("addCategory");
};

const editCategory = async (req, res) => {

    const category = await Categorydb.find({});

    res.render("category-edit", { category });
};

//post api 1
const product_add_post = async (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }

    const Product = await Productdb.find({ name: req.body.name });

    if (Product && Product[0]?.name != null) {
        res.redirect("/admin/product-add");
    } else {
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

    const Category = await Categorydb.find({ name: req.body.name });

    if (Category && Category[0]?.name != null) {
        res.redirect("/admin/product");
    } else {
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
    console.log("category_update......inside");
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

    if (!req.body) {
        return res.status(400).send({ message: "data to update can not be empty!" });
    }

    const id = req.params.id;

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
    const Coupon = await Coupondb.find({ name: req.body.name });
    if (Coupon && Coupon[0]?.name != null) {
        res.redirect("/admin/coupon");
    } else {
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

    res.render("coupon-edit", { coupon });
};

const offer_get = async (req, res) => {
    const offerdb = await Offerdb.find({});
    res.render("offer", { category: offerdb });
};

const addOfferPost = async (req, res) => {
    const Offer = await Offerdb.find({ name: req.body.name });

    if (Offer && Offer[0]?.name != null) {
        res.render("offer-add");
    } else {
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

    if (req.query.id === "full"){
        const orderdata = await ordersdb.find();

        const totalDelivery = orderdata.filter((data) => data.status === "delivered");
        const totalCancelled = orderdata.filter((data) => data.status === "cancell");
        const totalReturn = orderdata.filter((data) => data.status === "returned");
        const chartdata = [
            { label: "Delivered", value: totalDelivery.length },
            { label: "cancel", value: totalCancelled.length },
            { label: "returned", value: totalReturn.length },
        ];
        res.json(chartdata);
    }
};
const pdf = async (req, res) => {
    let arr = [];

    const orders = await ordersdb.find({});
    const product = await Productdb.find({});

    res.render("pdf", { orders, product });
    // res.render("pdf");
};

const invoice = async (req, res) => {
    console.log("start.........");

    console.log(req.body.value + "dataa.......");

    const year = 2023; // Replace with the desired year

    const result = await ordersdb.find({
        createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
    });

    console.log(result);
};

const pdf_downloard = async (req, res) => {
    try {
        console.log("pdf_downloard");
        console.log(req.body)
        let mode = req.body.mode;
        let year = parseInt(req.body.year) ;
        let month = parseInt(req.body.month) ;
        let custom = req.body.custom;
        let dateParts;

        function separateDate(dateString) {
            const parts = dateString.split("-"); // Assumes format is YYYY-MM-DD
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const day = parseInt(parts[2]);
            return { year, month, day };
          }

          if(mode == "Weekly"){
             dateParts = separateDate(custom);
            }
        // var salesData;

        const getSalesDataByYearAndMonth = async (year, month) => {
            try {
                let salesData = await Salesdb.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: "$createdAt" }, year] },
                                    { $eq: [{ $month: "$createdAt" }, month] },
                                ],
                            },
                        },
                    },
                ]).then((data) => {
                    // Generate the PDF start
                    const doc = new PDFDocument();
                    doc.pipe(fs.createWriteStream("report.pdf"));

                    // Add content to the PDF
                    doc.fontSize(12).text("Report ", { align: "center" });
                    doc.text("--------------------------");

                    data.forEach((document) => {
                        doc.text(`Product: ${document.productNames}`);
                        doc.text(`Category: ${document.category}`);
                        doc.text(`Quantity: ${document.quantity}`);
                        doc.text(`Amount: ${document.amount}`);
                        doc.text("--------------------------");
                    });

                    // Stream the PDF to the response
                    const filename = "report.pdf";
                    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
                    res.setHeader("Content-Type", "application/pdf");
                    doc.pipe(res);
                    doc.end();
                    console.log("PDF report generated successfully.");

                    // Generate the PDF end
                });

                // Access the sales data for the specified year and month
                //  console.log(salesData);
            } catch (error) {
                // Handle the error
                console.error(error);
            }
        };

        const getSalesDataByYear = async (year) => {
            try {
                const salesData = await Salesdb.aggregate([
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $year: "$createdAt" }, year],
                            },
                        },
                    },
                ]).then((data) => {
                    console.log("then start......")
                    console.log(data)
                    // Generate the PDF start
                    const doc = new PDFDocument();
                    doc.pipe(fs.createWriteStream("report.pdf"));

                    // Add content to the PDF
                    doc.fontSize(12).text("Report ", { align: "center" });
                    doc.text("--------------------------");

                    data.forEach((document) => {
                        doc.text(`Product: ${document.productNames}`);
                        doc.text(`Category: ${document.category}`);
                        doc.text(`Quantity: ${document.quantity}`);
                        doc.text(`Amount: ${document.amount}`);
                        doc.text("--------------------------");
                    });

                    // Stream the PDF to the response
                    const filename = "report.pdf";
                    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
                    res.setHeader("Content-Type", "application/pdf");
                    doc.pipe(res);
                    doc.end();
                    console.log("PDF report generated successfully.");

                    // Generate the PDF end
                });
            } catch (error) {
                // Handle the error
                console.error(error);
            }
        };

        const getSalesDataByYearMonthDay = async (year, month, day) => {
            try {
                const salesData = await Salesdb.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: "$createdAt" }, year] },
                                    { $eq: [{ $month: "$createdAt" }, month] },
                                    { $eq: [{ $dayOfMonth: "$createdAt" }, day] },
                                ],
                            },
                        },
                    },
                ]).then((data) => {
                    console.log("then start......")
                    console.log(data)
                    // Generate the PDF start
                    const doc = new PDFDocument();
                    doc.pipe(fs.createWriteStream("report.pdf"));

                    // Add content to the PDF
                    doc.fontSize(12).text("Report ", { align: "center" });
                    doc.text("--------------------------");

                    data.forEach((document) => {
                        doc.text(`Product: ${document.productNames}`);
                        doc.text(`Category: ${document.category}`);
                        doc.text(`Quantity: ${document.quantity}`);
                        doc.text(`Amount: ${document.amount}`);
                        doc.text("--------------------------");
                    });

                    // Stream the PDF to the response
                    const filename = "report.pdf";
                    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
                    res.setHeader("Content-Type", "application/pdf");
                    doc.pipe(res);
                    doc.end();
                    console.log("PDF report generated successfully.");

                    // Generate the PDF end
                });
            } catch (error) {
                // Handle the error
                console.error(error);
            }
        };

        if (mode == 'Yearly') {

            // Example: Get all sales data for the year 2023
            getSalesDataByYear(year);
        } else if (mode == "Monthly") {

            // Example: Get sales data for the year 2023 and month 3
            getSalesDataByYearAndMonth(year, month);
        } else {

            // Example: Get all sales data for the year 2023, month 3, and day 15
            getSalesDataByYearMonthDay(dateParts.year, dateParts.month, dateParts.day);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    index,
    logout,
    adminLogin,
    product_add,
    product_add_post,
    product,
    addCategory,
    categorypost,
    product_edit,
    update_products,
    editCategory,
    category,
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
    graph_data,
    pdf,
    invoice,
    pdf_downloard,
    signIn_post,
    poductpagin
};
