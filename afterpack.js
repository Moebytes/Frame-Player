const fs = require("fs")
const path = require("path")

exports.default = async function (context) {
    if (context.packager.platform.name !== "mac") return

    const appPath = context.appOutDir
    const appName = context.packager.appInfo.productFilename + ".app"

    const ffmpegPath = path.join(appPath, appName, "Contents/ffmpeg/ffmpeg")
    const ffprobePath = path.join(appPath, appName, "Contents/ffmpeg/ffprobe")

    fs.chmodSync(ffmpegPath, 0o755)
    fs.chmodSync(ffprobePath, 0o755)
}