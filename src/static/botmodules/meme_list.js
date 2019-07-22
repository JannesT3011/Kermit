const path = require("path")
const fs = require("fs")

module.exports = function(message) {
    const img_path = "src/memes"
    const _memes = []
    fs.readdir(img_path, function (err, files) {
        files.forEach(function (file) {
            _memes.push(file.split(".")[0])
        })
        return message.channel.send("```" + _memes + "```")
    })
}
