import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const activeSlice = createSlice({
    name: "active",
    initialState: {
        hover: true,
        videoDrag: true,
        fxDialogActive: false
    },
    reducers: {
        setHover: (state, action) => {state.hover = action.payload},
        setVideoDrag: (state, action) => {state.videoDrag = action.payload},
        setFXDialogActive: (state, action) => {state.fxDialogActive = action.payload}
    }    
})

const {
    setHover, setVideoDrag, setFXDialogActive
} = activeSlice.actions

export const useActiveSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        hover: selector((state) => state.active.hover),
        videoDrag: selector((state) => state.active.videoDrag),
        fxDialogActive: selector((state) => state.active.fxDialogActive)
    }
}

export const useActiveActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setHover: (state: boolean) => dispatch(setHover(state)),
        setVideoDrag: (state: boolean) => dispatch(setVideoDrag(state)),
        setFXDialogActive: (state: boolean) => dispatch(setFXDialogActive(state))
    }
}

export default activeSlice.reducer