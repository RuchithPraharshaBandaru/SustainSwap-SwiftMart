import express from 'express';
const app = express();
import session from 'express-session';
import path from "path"
import expressLayouts from 'express-ejs-layouts'
import userController from "./routes/user.js"
import productRouter from "./routes/product.js"
import sellerRouter from "./routes/seller.js"
import adminRouter from "./routes/admin.js"
import industryRouter from "./routes/industry.js"
import managerRouter from "./routes/manager.js"
import dbConnection from "./config/db.js"
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import multer from "multer"

// Only run dotenv.config() in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({});
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS to use an environment variable for the client origin
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:8000";

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configure session to use an environment variable for the secret
const sessionSecret = process.env.SESSION_SECRET || "secret-swiftmart";
if (sessionSecret === "secret-swiftmart" && process.env.NODE_ENV === "production") {
  console.warn("WARNING: Using default session secret in production! Please set a strong SESSION_SECRET environment variable.");
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }, 
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use("/api/v1/user", userController);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/seller",sellerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/industry", industryRouter);
app.use("/api/v1/manager", managerRouter);


app.get("/", (req, res) => {
  res.render("Home/index.ejs", { title: "Home", role: "seller" });
})

app.get("*", (req, res) => {
  
  res.json({
    message: "Acess denied"
  })
})



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  dbConnection();
  console.log(`Server running on http://localhost:${PORT}`)
});
