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