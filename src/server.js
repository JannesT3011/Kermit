const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser");
const path = require("path")
const fs = require("fs")

class Server {

    constructor(token, port, bot) {
        this.token = token
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
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.init()

        this.server = this.app.listen(port, function()  {
            console.log("Server is running on port " + port)
        })
    }

    init() {
        this.app.get("/", (req, res) => {
            var _channels = [];
            this.bot.guilds.first().channels
                .filter(ctx => ctx.type == "text")
                .forEach(ctx => {
                    _channels.push({id: ctx.id, name: ctx.name})
                })
            var _images = []
            const img_path = path.join(__dirname, 'img/');
            fs.readdir(img_path, function (err, files) {
                files.forEach(function (file) {
                    // console.log(img_path + file)
                    _images.push({path: img_path + file, name: file}) 
                })
            })

            return res.render("index", {title: "Kermit", channels: _channels, images: _images})
        })

        this.app.post("/send_msg", (req, res) => {
            var channelid = req.body.channelid
            var text = req.body.text

            var channel = this.bot.guilds.first().channels.get(channelid)
            if (channel) {
                return channel.send(text)
            }
        })
    }

}

module.exports = Server
