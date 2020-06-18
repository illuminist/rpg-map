import _ from 'lodash'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as resourceUtils from 'helpers/resourceUtils'
import {
  getTransparentImage,
  getTransparentImageHash,
} from 'helpers/imageUtils'
import makeUrl from 'helpers/makeUrl'

export type ResourceStore = {
  [resourceType: string]: { [resourceName: string]: any }
}

export const loadDataResource = createAsyncThunk(
  'loadDataResource',
  async (arg: { resourceType: string; url: string }) => {
    return resourceUtils.loadDataResource(arg.url)
  },
)

export const processImage = createAsyncThunk(
  'processImage',
  async (args: { src: string; transparentColor?: string[] }) =>
    new Promise<{ src: string }>((resolve) => {
      const img = document.createElement('img')
      img.src = makeUrl(args.src)
      img.onload = () => {
        if (args.transparentColor) {
          resolve({
            src: getTransparentImage(img, args.transparentColor) as string,
          })
        } else {
          resolve({ src: makeUrl(args.src) })
        }
      }
    }),
)

export const resource = createSlice({
  name: 'resource',
  initialState: {} as ResourceStore,
  reducers: {},
  extraReducers: (builder): any =>
    builder
      .addCase(loadDataResource.fulfilled, (state, action) => {
        _.set(
          state,
          [action.meta.arg.resourceType, action.meta.arg.url],
          action.payload,
        )
      })
      .addCase(processImage.fulfilled, (state, action) => {
        _.set(
          state,
          ['image', getTransparentImageHash(action.meta.arg)],
          action.payload.src,
        )
      }),
})

const extraActions = {
  loadDataResource,
  processImage,
}
resource.actions = Object.assign(resource.actions, extraActions)

export default resource as typeof resource & {
  actions: typeof extraActions
}
