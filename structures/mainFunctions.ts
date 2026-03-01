/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Motion Player - A cute video player ❤                     *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import fs from "fs"
import path from "path"
import child_process from "child_process"
import functions from "./functions"

const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"]
const animationExtensions = [".gif", ".webp", ".apng", ".png", ".zip"]

export default class MainFunctions {
    public static spawn = async (file: string, args: string[]): 
        Promise<{stdout: string, stderr: string, code?: number}> => {
            return new Promise((resolve, reject) => {
                const child = child_process.spawn(file, args, {windowsHide: true})

                let stdout = ""
                let stderr = ""

                child.stdout.on("data", (data) => {
                    stdout += data.toString()
                })

                child.stderr.on("data", (data) => {
                    stderr += data.toString()
                })

                child.on("error", (err) => {
                    reject(err)
                })

                child.on("close", (code) => {
                    if (code === 0) {
                        resolve({stdout, stderr})
                    } else {
                        reject({stdout, stderr, code})
                    }
                })
        })
    }

    public static getSortedFiles = async (dir: string) => {
        const accepted = [...videoExtensions, ...animationExtensions]

        const files = await fs.promises.readdir(dir)

        const validFiles = await Promise.all(files.map(async (fileName: string) => {
            const ext = path.extname(fileName)
            if (!accepted.includes(ext)) return null

            const filePath = path.join(dir, fileName)

            if (ext === ".png" || ext === ".webp" || ext === ".zip") {
                const buffer = await fs.promises.readFile(filePath)
                let valid = false

                if (ext === ".png") {
                    valid = functions.isAnimatedPng(buffer.buffer)
                } else if (ext === ".webp") {
                    valid = functions.isAnimatedWebp(buffer.buffer)
                } else if (ext === ".zip") {
                    valid = await functions.isUgoiraZip(buffer.buffer)
                }
                if (!valid) return null
            }

            const stats = await fs.promises.stat(filePath)
            return {name: fileName, time: stats.mtime.getTime()}
        }))

        return validFiles
            .filter((file): file is {name: string; time: number} => file !== null)
            .sort((a, b) => b.time - a.time)
            .map(file => file.name)
    }

    public static getNodePath = () => {
        const exists = (path: string) => fs.existsSync(path)

        if (process.platform === "win32") {
            const winPaths = [
                "C:\\Program Files\\nodejs\\node.exe",
                "C:\\Program Files (x86)\\nodejs\\node.exe"
            ]
            return winPaths.find(exists) ?? "node"
        } else if (process.platform === "darwin") {
            const macPaths = [
                "/opt/homebrew/bin/node",
                "/usr/local/bin/node"
            ]
            return macPaths.find(exists) ?? "node"
        } else {
            const linuxPaths = [
                "/usr/bin/node",
                "/usr/local/bin/node"
            ]
            return linuxPaths.find(exists) ?? "node"
        }
    }

    public static removeDirectory = (dir: string) => {
        if (!fs.existsSync(dir)) return
        fs.readdirSync(dir).forEach((file: string) => {
            const current = path.join(dir, file)
            if (fs.lstatSync(current).isDirectory()) {
                MainFunctions.removeDirectory(current)
            } else {
                fs.unlinkSync(current)
            }
        })
        try {
            fs.rmdirSync(dir)
        } catch (e) {
            console.log(e)
        }
    }
}