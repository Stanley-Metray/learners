console.clear();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pug from 'pug';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import { UserModel, verifyUser, verifyEmailAndPassword, checkCourse, getUser } from './module/module.js';

const port = process.env.PORT || 2000;

const app = express();
const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);
const templatesDirectory = path.join(__dirname, "../templates");
const assets = path.join(__dirname, "../templates/assets");
const images = path.join(__dirname, "../templates/images");

// app.use(favicon(path.join))

app.use(favicon(path.join(__dirname, "../templates", "favicon-32x32.ico")));
app.use(express.static(images));
app.use(express.static(assets));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "pug");
app.set("views", templatesDirectory);


app.get("/", (req, res) => {
    res.render("index");
});

app.post("/buy", (req, res) => {
    if (req.cookies.username == undefined || req.cookies.email == undefined)
        res.render("register");
    else
        res.render("buy", {
            course: {
                courseName: req.body.courseName,
                coursePrice: req.body.coursePrice,
                courseDuration: req.body.courseDuration,
                username: req.cookies.username,
                email: req.cookies.email,
                imgName : req.body.courseName+".png"
            }
        });
});


app.post("/register", (req, res) => {

    verifyUser(req.body.email).then((data) => {
        if (data == false) {
            let User = new UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            });
            User.save();
            res.cookie("username", User.firstName, { maxAge: 1000 * 60 * 60 * 24 * 365 });
            res.cookie("email", User.email, { maxAge: 1000 * 60 * 60 * 24 * 365 });
            res.render("index", {user : {
                userName : req.body.firstName
            }});
        }
        else
            res.render("register", { message: "Email already exists..." });
    }).catch((err) => {
        res.send(err);
    });
});

app.get("/sign-up", (req, res) => {
    res.render("register");
});

app.post("/purchase", async (req, res) => {
    try {
        let check = await checkCourse(req.body.userEmail, req.body.courseName);
        if (check)
            res.send("Already you have purchased this course");
        else {
            const result = await UserModel.updateOne({ email: req.body.userEmail }, {
                $push: {
                    "courses": {
                        courseName: req.body.courseName,
                        courseDuration: req.body.courseDuration,
                        coursePrice: req.body.coursePrice
                    }
                }
            });

            if (result.modifiedCount == 0)
                res.send("Something went wrong... Please try again...");
            else
                res.send(`Congratulations you have successfully purchased the course `);
        }
    } catch (error) {
        res.send(error.message);
    }
});


app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login-user", async (req, res) => {
    const User = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        let data = await verifyEmailAndPassword(User.email, User.password);
        if (data != false) {
            res.cookie("username", data, { maxAge: 1000 * 60 * 60 * 24 * 365 });
            res.cookie("email", User.email, { maxAge: 1000 * 60 * 60 * 24 * 365 });
            res.redirect("/");
        }
        else
            res.render("login", { message: "Invalid email and password" });
    } catch (error) {
        res.send(error);
    }
});

app.get("/profile", async (req,res)=>{
    try {
        const user = await getUser(req.cookies.email);
        let courses = "";
        user.courses.forEach((element)=>{
            courses += element.courseName+", ";
        });
        res.render("profile", {
            User : {
                userName : user.firstName+" "+user.lastName,
                email : user.email,
                courses : courses
            }
        });
    } catch (error) {
        res.send(error);
    }
});


app.get("/logout", (req,res)=>{
    res.clearCookie("email");
    res.clearCookie("username");
    res.redirect("/");
});


app.listen(port);