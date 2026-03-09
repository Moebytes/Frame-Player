/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Frame Player - A cute video player ❤                     *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"

const ContextMenu: React.FunctionComponent = (props) => {
    useEffect(() => {
        window.oncontextmenu = (event: MouseEvent) => {
            event.preventDefault()
            const selectedText = window.getSelection()?.toString().trim()
            window.ipcRenderer.invoke("context-menu", {
                hasSelection: Boolean(selectedText)
            })
        }
    }, [])

    return null
}

export default ContextMenu