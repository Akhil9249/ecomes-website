const axios = require("axios");

const Userdb = require("../models/userModel");

const Productdb = require("../models/productModel");

const Categorydb = require("../models/categoryModel");

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

//2.2
const find = (req,res)=>{
    console.log("2")
    Userdb.find()
    .then((user)=>{

        res.send(user);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || "error occered" });
    });
}

//3.1
const product = (req, res) => {
    console.log("1")
    axios
        .get("http://localhost:3000/admin/check/product")
        .then((response) => {
            console.log("end")  
            res.render("product", { products: response.data });
        })
        .catch((err) => {
            res.send(err);
        });
};

//3.2 and 5
const productfind = (req, res) => {
    console.log("otu side id 2")
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
        console.log("Inside find 3")
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

   const category = await Categorydb.find({})
   console.log(category+"category............")

    axios
        .get("http://localhost:3000/admin/check/product", { params: { id: req.query.id } })

        .then(function (userdata) {
            res.render("product-edit", { user: userdata.data ,category });
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
    // res.render("category");
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

    // axios
    // .get("http://localhost:3000/admin/check/category", { params: { id: req.query.id } })

    // .then(function (userdata) {
    //     res.render("category-edit", { user: userdata.data });
    // })
    // .catch((err) => {
    //     res.send(err);
    // });

    const category = await Categorydb.find({})
    console.log(category+"category............")

    res.render("category-edit", {   category });
 
    //  axios
    //      .get("http://localhost:3000/admin/check/product", { params: { id: req.query.id } })
 
    //      .then(function (userdata) {
    //          res.render("product-edit", { user: userdata.data ,category });
    //      })
    //      .catch((err) => {
    //          res.send(err);
    //      });



};



//post api 1
const product_add_post = (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }

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
};

//post api 2
const categorypost = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "contant can not be empty!" });
        return;
    }

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
          await Userdb.findByIdAndUpdate(
            { _id: id },
            { $set: { isVerified: false } }
          );
      
        } else {
          await Userdb.findByIdAndUpdate(
            { _id: id },
            { $set: { isVerified: true } }
          );
    
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
    console.log("hiiiiiiiii") 
  const value = req.query.id

 const category = await Categorydb.findById(value)
 console.log(category+"category.....")
 res.render("category-edit-save",{category})  
  
  

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
    eidt_category
};
