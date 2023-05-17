import express from "express";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import { __dirname } from "./path.js";
import multer from "multer";
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.set("io", io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const upload = multer({ storage: storage });
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/", express.static(__dirname + "/public"));
app.post("/upload", upload.single("product"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.send("Imagen subida");
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/chat", (req, res) => {
  res.render("chat");
});

const mensajes = [];

io.on("connection", (socket) => {
  console.log("Cliente conectado");
  app.set("io", socket);
  socket.on("mensaje", (info) => {
    console.log(info);
    mensajes.push(info);
    io.emit("mensajes", mensajes);
  });
  // console.log("Cliente Conectado");

  // socket.on('mensaje', info => {
  //     console.log(info);
  // });

  // socket.on('user', info => {
  //     console.log(info);
  //     socket.emit("confirmacionAcceso", "Acceso concedido");
  // });
});
