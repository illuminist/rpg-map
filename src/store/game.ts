import _ from 'lodash'
import { MapType } from 'maptype'
import { createAction, createReducer } from '@reduxjs/toolkit'

export const initMap = createAction<MapType>('initMap')
export const gameReducer = createReducer<MapType>(null as any, (builder) =>
  builder.addCase(initMap, (state, action) => {
    return _.cloneDeep(action.payload)
  }),
)