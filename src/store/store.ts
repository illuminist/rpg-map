import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { cameraReducer } from './camera'
import { gameReducer } from './game'

const store = configureStore({
  reducer: combineReducers({ camera: cameraReducer, map: gameReducer }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}

export type ThunkConfig = {
  // dispatch: AppDispatch
  // state: RootState
}

export default store
