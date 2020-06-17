import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { cameraReducer } from './camera'
import { gameReducer } from './game'
import editor, { EditorState } from './editor'
import { useSelector } from 'react-redux'
import { resource } from './resource'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['resource'],
}

const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      camera: cameraReducer,
      map: gameReducer,
      editor: editor.reducer,
      resource: resource.reducer,
    }),
  ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useEditorState = <T extends any>(
  selector: (editorState: EditorState) => T,
) => useSelector((state) => selector(state.editor))

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}

export type ThunkConfig = {
  dispatch: AppDispatch
  state: RootState
}

export const persistor = persistStore(store)

export default store
