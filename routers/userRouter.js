const express = require("express");
const userControllers = require("../controller/userControllers");
const session = require("express-session");
const middleware = require("../middleware/userAuth");
// const nocache = require('nocache')
const { v4: uuidv4 } = require("uuid");

const router = express();
// router.use(nocache())

router.use(
    session({
        secret: uuidv4(),
        resave: false,
        saveUninitialized: true,
    })
);

// router.use(function(req, res, next) {
//     res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//     next();
//   });

router.get("/", middleware.isVerified, userControllers.home);

router.get("/login", middleware.sessionRepeat, userControllers.login);

router.post("/signin", userControllers.signin);

router.get("/register", middleware.isLogin, userControllers.register);

router.post("/api/users", userControllers.create);

router.get("/logout", userControllers.logout);

router.get("/product", middleware.isVerified, userControllers.product);

router.get("/single-product", middleware.isVerified, userControllers.single_product);

router.get("/wishlist", middleware.isSession, middleware.isVerified, userControllers.wishlist);

router.put("/addwishlist", middleware.isSession, userControllers.addwishlistput);

router.put("/wishlist/remove", userControllers.wishlistremove);

router.get("/cart", middleware.isSession, middleware.isVerified, userControllers.cart);

router.put("/addcart", middleware.isSession, userControllers.addcartput);

router.put("/cart/updat", userControllers.cartupdat);

router.put("/cart/remove", userControllers.cartremove);

router.get("/dashboard", middleware.isSession, middleware.isVerified, userControllers.dashboard);

router.post("/dashboardpost", middleware.isSession, userControllers.dashboardpost);

router.get("/forgotnumber", middleware.isLogin, userControllers.forgotnumber);

router.get("/newpassword", userControllers.newpassword);

router.post("/checknumber", userControllers.checknumber);

router.get("/otppage", userControllers.generate, userControllers.otppage);

router.post("/otppost", userControllers.otppost);

router.post("/passwordchange", userControllers.passwordchange);

router.get("/checkout", middleware.isSession, middleware.isVerified, userControllers.checkout);

router.get("/oddersuccess", middleware.isSession, userControllers.oddersuccess);

router.post("/odder/successpost/Check", userControllers.odder_success_Check);

router.post("/oddersuccesspost", userControllers.oddersuccesspost);

router.post("/check/phoneup", userControllers.checkphoneup);

router.get("/orderStatus", middleware.isVerified, userControllers.orderStatus);

router.put("/couponCodeCheck", middleware.isSession, userControllers.couponCodeCheck);

router.put("/return/reason", userControllers.return_reason);

router.get("/addressChange", userControllers.addressChange);

router.get("/user/check/product", userControllers.productfind); // x

router.get("/check/product", userControllers.productfind);

router.get("/user/filter/product", userControllers.productfilter); // x

router.post("/odder/cancel", userControllers.odder_cancel);

// ************************ product page ************************ //
router.post("/poduct/search", userControllers.productsearch);

router.post("/poduct/sortfind", userControllers.sortfind);

router.post("/poduct/filter", userControllers.filterfind);

router.get("/poduct/filter", userControllers.filterfindcategory); // x

router.post("/poduct/pagin", userControllers.poductpagin);

router.patch("/adress/update/:id", userControllers.adress_update);



module.exports = router;
