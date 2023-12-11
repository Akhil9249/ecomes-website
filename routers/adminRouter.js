const express = require("express");
const router = express();
const adminControllers = require("../controller/adminControllers");
const multer = require("../util/multer");

// const multer = require('../middleware/upload')
// const api=require('../server/services/render')
// admin/pages/samples/login.html

router.get("/login", adminControllers.adminLogin);

router.get("/index", adminControllers.index);

router.get("/", adminControllers.dashboard);

router.get("/product", adminControllers.product);

router.get("/product-add", adminControllers.product_add);

router.get("/update-products", adminControllers.update_products);

// router.get('/productupdate',adminControllers.product_update)

router.get("/category", adminControllers.category);

router.get("/addCategory", adminControllers.addCategory);

router.get("/editCategory", adminControllers.editCategory);

router.get("/block-user", adminControllers.block_user);

router.get("/editcategoryupdate", adminControllers.editcategoryupdate);

router.get("/order", adminControllers.order_details);

router.put("/status/change", adminControllers.status_change);

router.get("/coupon", adminControllers.coupon_get);

router.get("/addCoupon", adminControllers.addCoupon);

router.post("/addCouponPost", adminControllers.addCouponPost);

router.get("/editCoupon", adminControllers.editCoupon);

router.get("/offer", adminControllers.offer_get);

router.post("/addOfferPost", adminControllers.addOfferPost);

router.get("/addOffer", adminControllers.addOffer);

router.get("/editOffer", adminControllers.editOffer);

router.get("/block-products", adminControllers.block_products);

router.get("/block-offer", adminControllers.block_offer);

router.get("/block-coupon", adminControllers.block_coupon);

router.post("/graph/data", adminControllers.graph_data);


//api
router.post("/product-add", multer.upload.array("simage"), adminControllers.product_add_post);

router.post("/addCategory", adminControllers.categorypost);

router.post("/admin/product-edit", adminControllers.product_edit);

router.put("/api/users/:id", adminControllers.product_update);

router.put("/category/users/:id", adminControllers.category_update);

router.put("/coupon/update/:id", adminControllers.coupon_update);

router.put("/offer/update/:id", adminControllers.offer_update);

router.put("/eidt-category/:id", adminControllers.eidt_category);



// router.get('/admin/users',adminControllers.find)

// router.get('/admin/users',api.find)

module.exports = router;
