import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { cameraReducer } from './camera'
import { gameReducer } from './game'

const store = configureStore({
  reducer: combineReducers({ camera: cameraReducer, map: gameReducer }),
})

export type RootState = ReturnType<typeof store.getState>

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}

export default store
