import { Position, Size2D } from 'maptype'
import { createAction, createReducer } from '@reduxjs/toolkit'

type CameraState = {
  isMoving: boolean
  moveSourcePosition: Position | null
  cameraOriginalPosition: Position | null
  position: Position
  zoom: number
  isZooming: boolean
}
const initialCameraState: CameraState = {
  isMoving: false,
  cameraOriginalPosition: null,
  moveSourcePosition: null,
  position: {
    x: 0,
    y: 0,
  },
  zoom: 1,
  isZooming: false,
}

export const cameraMoveStart = createAction<{ sourcePosition: Position }>(
  'cameraMoveStart',
)
export const cameraZoomRelative = createAction<{
  zoom: number
  center: Position
  screen: Size2D
}>('cameraZoomRelative')
export const cameraMoveRelative = createAction<Position>('cameraMoveRelative')
export const cameraMoveSourceRelative = createAction<Position>(
  'cameraMoveSourceRelative',
)
export const cameraMoveEnd = createAction('cameraMoveEnd')
export const cameraZoomStart = createAction('cameraZoomStart')
export const cameraZoomEnd = createAction('cameraZoomEnd')
export const cameraReducer = createReducer(initialCameraState, (builder) =>
  builder
    .addCase(cameraMoveStart, (state, action) => {
      state.isMoving = true
      state.moveSourcePosition = action.payload.sourcePosition
      state.cameraOriginalPosition = { ...state.position }
    })
    .addCase(cameraMoveEnd, (state, action) => {
      state.isMoving = false
    })
    .addCase(cameraMoveRelative, (state, action) => {
      state.position.x += action.payload.x
      state.position.y += action.payload.y
    })
    .addCase(cameraMoveSourceRelative, (state, action) => {
      state.position.x =
        state.cameraOriginalPosition!.x +
        state.moveSourcePosition!.x -
        action.payload.x
      state.position.y =
        state.cameraOriginalPosition!.y +
        state.moveSourcePosition!.y -
        action.payload.y
    })
    .addCase(cameraZoomStart, (state, action) => {
      state.isZooming = true
    })
    .addCase(cameraZoomEnd, (state, action) => {
      state.isZooming = false
    })
    .addCase(
      cameraZoomRelative,
      (state, { payload: { center, zoom, screen } }) => {
        const originalZoom = state.zoom

        const maxZoomOut = 0.25
        const maxZoomIn = 4

        const newZoom = Math.min(
          maxZoomIn,
          Math.max(maxZoomOut, state.zoom + zoom),
        )
        const zoomDeltaRatio = newZoom / originalZoom
        const zoomDelta = newZoom - originalZoom

        const zoomPosLag = 1

        const dcx = center.x - screen.width / 2
        const dcy = center.y - screen.height / 2

        const worldCenterPost = {
          x: (state.position.x + dcx) / originalZoom,
          y: (state.position.y + dcy) / originalZoom,
        }

        const screenCenterDeltaCamPos = {
          x: dcx * -zoomDeltaRatio * zoomPosLag,
          y: dcy * -zoomDeltaRatio * zoomPosLag,
        }

        const centerDeltaCamPos = {
          x: worldCenterPost.x * -zoomDelta * zoomPosLag,
          y: worldCenterPost.y * -zoomDelta * zoomPosLag,
        }

        const screenCenterDistance = Math.sqrt(dcx * dcx + dcy * dcy)

        // centerRatio = 0 fixed zoom center
        // centerRatio = 1 zoom center to screen center
        const centerRatio = 0.5 * Math.min(1, (1 / screenCenterDistance) * 20)
        // const centerRatio = 0

        const deltaCamPos = {
          x:
            centerDeltaCamPos.x -
            (centerDeltaCamPos.x - screenCenterDeltaCamPos.x) * centerRatio,
          y:
            centerDeltaCamPos.y -
            (centerDeltaCamPos.y - screenCenterDeltaCamPos.y) * centerRatio,
        }

        const position = {
          x: state.position.x - deltaCamPos.x,
          y: state.position.y - deltaCamPos.y,
        }
        state.zoom = newZoom
        state.position = position
      },
    ),
)
