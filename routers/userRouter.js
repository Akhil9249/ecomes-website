const express = require("express");
const userControllers = require("../controller/userControllers");
const session = require("express-session");
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

// ****************************** checkmiddleware ****************************** //
function abc(req, res, next) {
    console.log("middleware...products", req.body);
    next();
}
// ****************************** checkmiddleware ****************************** //

router.get("/", userControllers.home);

router.get("/login", userControllers.login);

router.post("/signin", userControllers.signin);

router.get("/register", userControllers.register);

router.post("/api/users", userControllers.create);

router.get("/logout", userControllers.logout);

router.get("/product", userControllers.product);

router.get("/single-product", userControllers.single_product);

// router.get('/category',userControllers.category)

router.get("/wishlist", userControllers.wishlist);

router.put("/addwishlist", userControllers.addwishlistput);

router.put("/wishlist/remove", userControllers.wishlistremove);

router.get("/cart", userControllers.cart);

router.put("/addcart", userControllers.addcartput);

router.put("/cart/updat", userControllers.cartupdat);

router.put("/cart/remove", userControllers.cartremove);

router.get("/dashboard", userControllers.dashboard);

router.post("/dashboardpost", userControllers.dashboardpost);

router.get("/forgotnumber", userControllers.forgotnumber);

router.get("/newpassword", userControllers.newpassword);

router.post("/checknumber", userControllers.checknumber);

// router.post('/resendotp',userControllers.checknumber)

router.get("/otppage", userControllers.generate, userControllers.otppage);

router.post("/otppost", userControllers.otppost);

router.post("/passwordchange", userControllers.passwordchange);

// router.get('/addcart',userControllers.addcart)

router.get("/checkout", userControllers.checkout);

router.get("/oddersuccess", userControllers.oddersuccess);

router.post("/oddersuccesspost", userControllers.oddersuccesspost);

router.post("/check/phoneup", userControllers.checkphoneup);

router.get("/orderStatus", userControllers.orderStatus);

router.put("/couponCodeCheck", userControllers.couponCodeCheck);

router.put("/return/reason", userControllers.return_reason);

router.get("/addressChange", userControllers.addressChange);

// router.put('/check/user?id',userControllers.block_user_find)
// router.post('/addAddress',userControllers.addAddress)
//post methode

router.get("/user/check/product", userControllers.productfind);

router.get("/check/product", userControllers.productfind);

router.get("/user/filter/product", userControllers.productfilter);

// router.get('/user/filter/sort',userControllers.sortfilter)

router.post("/odder/cancel", userControllers.odder_cancel);

// ************************ product page ************************ //
router.post("/poduct/search", userControllers.productsearch);

router.post("/poduct/sortfind", userControllers.sortfind);

router.post("/poduct/filter", userControllers.filterfind);

router.get("/poduct/filter", userControllers.filterfindcategory);

router.post("/poduct/pagin", userControllers.poductpagin);

router.put("/adress/update/:id", userControllers.adress_update);

// ************************ product page ************************ //

module.exports = router;
