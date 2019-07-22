const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser");
const path = require("path")
const fs = require("fs")

class Server {

    constructor(port, bot) {
        this.port = port
        this.bot = bot
        this.app = express()

        this.app.engine("hbs", hbs({
            extname: "hbs",                    
            defaultLayout: "layout",           
            layoutsDir: __dirname + "/layouts" 
        }))
        this.app.set("views", path.join(__dirname, "views"))
        this.app.set("view engine", "hbs")
        this.app.use(express.static(path.join(__dirname, "static")))
        this.app.use(express.static(path.join(__dirname, "memes")))
        this.app.use(express.static(path.join(__dirname, "img")))
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.init()

        this.server = this.app.listen(port, function()  {
            console.log("Server is running on port " + port)
            console.log("http://localhost:" + port)
        })
    }

    init() {
        this.app.get("/", (req, res) => {
            var _images = []
            const img_path = path.join(__dirname, "memes/")
            fs.readdir(img_path, function (err, files) {
                files.forEach(function (file) {
                    var _uri = file.replace(".", "$")
                    _images.push({path: file, name: file.split(".")[0], uri: _uri})
                })
            })

            return res.render("index", {title: "Kermit", images: _images})
        })

        this.app.get("/:img_name", (req, res) => {
            var img_name = req.params.img_name
            var _img = img_name.replace("$", ".")
            var _url = "/" + img_name + "/send"
            var _channels = [];
            this.bot.channels
                .filter(ctx => ctx.type == "text")
                .forEach(ctx => {
                    _channels.push({id: ctx.id, name: ctx.name, server: ctx.guild.name})
                })

            return res.render("meme", {title: img_name.split("$")[0], img: _img, alt: img_name.split("$")[0], url: _url, channels: _channels})
        })

        this.app.post("/:img_name/send", (req, res) => {
            var img_name = req.params.img_name.replace("$", ".")
            var channelid = req.body.channelid
            // console.log(channelid)
            var _channel = this.bot.channels.get(channelid)
            if (channelid == "undefined" || channelid == undefined) {
                return res.render("error", {title: "Error", error: "Cant find this channel ~ `undifined` !"})
            }
            _channel.send({
                files: [path.join(__dirname, "memes/" + img_name)]
            })
            return res.redirect("/" + req.params.img_name)
        })
    }

}

module.exports = Server
