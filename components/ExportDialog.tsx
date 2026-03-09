/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Frame Player - A cute video player ❤                     *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import functions from "../structures/functions"
import "./styles/exportdialog.less"

const ExportDialog: React.FunctionComponent = (props) => {
    const [visible, setVisible] = useState(false)
    const [percent, setPercent] = useState(0)
    const [timemark, setTimemark] = useState(0)
    const [duration, setDuration] = useState(0)
    const [type, setType] = useState("")

    useEffect(() => {
        const showExportDialog = (event: any, visible: boolean, type: string) => {
            setVisible(visible)
            setPercent(0)
            setTimemark(0)
            setDuration(0)
            setType(type)
        }
        const exportProgress = (event: any, progress: any) => {
            const time = functions.parseSeconds(progress.timemark)
            const duration = progress.duration

            if (!duration || !time || Number.isNaN(time) || Number.isNaN(duration)) {
                setPercent(0)
            } else {
                setPercent((time / duration) * 100)
            }

            setTimemark(time || 0)
            setDuration(duration || 0)
        }
        window.ipcRenderer.on("show-export-dialog", showExportDialog)
        window.ipcRenderer.on("export-progress", exportProgress)
        return () => {
            window.ipcRenderer.removeListener("show-export-dialog", showExportDialog)
            window.ipcRenderer.removeListener("export-progress", exportProgress)
        }
    }, [])

    if (visible) {
        return (
            <section className="export-dialog">
                <div className="export-dialog-box">
                    <div className="export-container">
                        <p className="export-dialog-text">{type === "gif" ? "Exporting gif..." : `Exporting video... ${percent.toFixed(0)}%`}</p>
                        {timemark ?
                        <p className="export-dialog-text">{functions.formatSeconds(timemark)}/{functions.formatSeconds(duration)}</p> 
                        : null}
                    </div>
                </div>
            </section>
        )
    }
    return null
}

export default ExportDialog