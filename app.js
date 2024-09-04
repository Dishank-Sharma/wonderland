if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsycn.js');
const ExpressError = require('./utils/expressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.json());

const dbUrl = process.env.ATLASDB_URL;

main().then(() => { console.log('Connected to Database') }).catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
};


//Home Route
app.get("/", (req, res) => {
    res.redirect("/listings")
});


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());  
app.use(passport.session());  
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.alert_success = req.flash("alert_success");
    res.locals.alert_error = req.flash("alert_error");
    res.locals.currUser = req.user;
    next();
});


app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: 'hacker@getMaxListeners.com',
        username: 'hacker020'
    })

    let registeredUser = await User.register(fakeUser, "hacker1@");
    res.send(registeredUser)
});




app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)


// For page not Found
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));

})


//error handling
app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Somethins went Wrong!" } = err;
    //For _ID Error
    if (err.path === "_id") {
        statusCode = 400;
        message = "Bad Request";
    }

    res.status(statusCode).render("error.ejs", { message });

});



const port = 8080;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});