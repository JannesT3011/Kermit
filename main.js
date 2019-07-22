const { Client } = require("discord.js")
const SERVER = require("./src/server")
const config = require("./config.json")
const CmdHandler = require("discordjs-cmds")
const meme_list = require("./src/static/botmodules/meme_list")

var bot = new Client()
var server = new SERVER(config.port, bot)
var cmd = new CmdHandler.CmdParser(bot, "kt.")

bot.on("ready", function () {
    console.log("Bot logged in!")
})

cmd
    .register(meme_list, "memes", ["memelist", "list_memes", "meme"], "Returns all avaible memes", null)

bot.login(config.token)