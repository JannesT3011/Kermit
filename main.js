const { Client } = require("discord.js")
const SERVER = require("./src/server")

var bot = new Client()
var server = new SERVER("1234", 8000, bot)
bot.on("ready", function () {
    console.log("Bot logged in!")
})

bot.login("")