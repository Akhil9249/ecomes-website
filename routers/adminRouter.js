const express = require("express");
const router = express();
const adminControllers = require("../controller/adminControllers");
const middleware = require("../middleware/adminAuth")
const multer = require("../util/multer");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

// const api=require('../server/services/render')

router.use(
    session({
        secret: uuidv4(),
        resave: false,
        saveUninitialized: true,
    })
);

router.get("/login", adminControllers.adminLogin); 

router.post("/signIn/post", adminControllers.signIn_post);

router.get("/logout", adminControllers.logout);

router.get("/index", middleware.role, adminControllers.index);

router.get("/", middleware.role, adminControllers.dashboard);

router.get("/product", middleware.role, adminControllers.product);

router.post("/poduct/pagin", adminControllers.poductpagin);

router.get("/product-add", middleware.role, adminControllers.product_add);

router.get("/update-products", middleware.role, adminControllers.update_products);

router.get("/category", middleware.role, adminControllers.category);

router.get("/addCategory", middleware.role, adminControllers.addCategory);

router.get("/editCategory", middleware.role, adminControllers.editCategory);

router.get("/block-user", middleware.role, adminControllers.block_user);

router.get("/editcategoryupdate", middleware.role, adminControllers.editcategoryupdate);

router.get("/order", middleware.role, adminControllers.order_details);

router.put("/status/change", adminControllers.status_change);

router.get("/coupon", middleware.role,  adminControllers.coupon_get);

router.get("/addCoupon", middleware.role, adminControllers.addCoupon);

router.post("/addCouponPost", adminControllers.addCouponPost);

router.get("/editCoupon", middleware.role, adminControllers.editCoupon);

router.get("/offer", middleware.role, adminControllers.offer_get);

router.post("/addOfferPost", adminControllers.addOfferPost);

router.get("/addOffer", middleware.role, adminControllers.addOffer);

router.get("/editOffer", middleware.role, adminControllers.editOffer);

router.get("/block-products", middleware.role, adminControllers.block_products);

router.get("/block-offer", middleware.role, adminControllers.block_offer);

router.get("/block-coupon", middleware.role, adminControllers.block_coupon);

router.post("/graph/data", adminControllers.graph_data);

router.get("/pdf", middleware.role, adminControllers.pdf);

router.post("/invoice/data", adminControllers.invoice);

router.post("/pdf/downloard", adminControllers.pdf_downloard);

router.post("/product-add", multer.upload.array("simage"), adminControllers.product_add_post);

router.post("/addCategory", adminControllers.categorypost);

router.post("/admin/product-edit", adminControllers.product_edit);

router.patch("/api/users/:id", adminControllers.product_update);

router.patch("/category/users/:id", adminControllers.category_update); //put change

router.patch("/coupon/update/:id", adminControllers.coupon_update);

router.patch("/offer/update/:id", adminControllers.offer_update);

router.patch("/eidt-category/:id", adminControllers.eidt_category);


// router.get('/productupdate',adminControllers.product_update)
// router.get('/admin/users',adminControllers.find)
// router.get('/admin/users',api.find)

module.exports = router;
