import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Formik, Form, Field, FieldProps } from 'formik'
import { TilesetDef } from 'maptype'
import { useEditorState } from 'store/store'
import { useDispatch } from 'react-redux'
import editor from 'store/editor'
import GridOverlay from 'components/GridOverlay'
import { useTheme } from '@material-ui/core'

export interface TilesetPropertyDialogProps
  extends Omit<DialogProps, 'open' | 'onClose'> {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

const initialTileDef: TilesetDef = {
  gridCount: { width: 3, height: 3 },
  gridSize: { width: 8, height: 8 },
  offset: { x: 0, y: 0 },
  image: { src: '', transparentColor: [] },
  tileDefs: [],
  localName: '',
}

export const dialogName = 'tilesetProperty'

const ColorSelector = ({
  classes,
  field,
  form,
  focus,
  onFocusChange,
}: {
  classes: ReturnType<typeof useStyles>
  focus: null | number
  onFocusChange: (i: number | null) => void
} & FieldProps<string[]>) => {
  const theme = useTheme()
  const tryColor = (c: string) => {
    try {
      return {
        backgroundColor: c,
        color: theme.palette.getContrastText(c),
      }
    } catch (e) {
      return undefined
    }
  }
  return (
    <>
      {field.value.map((c, i) => (
        <Chip
          key={c}
          style={tryColor(c)}
          onClick={() => {
            onFocusChange(i)
          }}
          className={classNames({ [classes.colorChipFocus]: focus === i })}
          onDelete={(e) => {
            onFocusChange(null)
            form.setFieldValue(field.name, _.without(field.value, c))
          }}
          label={c}
        />
      ))}
      <IconButton
        onClick={() => {
          const newV = _.uniq([...field.value, ''])
          form.setFieldValue(field.name, newV)
          onFocusChange(newV.length - 1)
        }}>
        <AddCircleIcon />
      </IconButton>
    </>
  )
}

export const TilesetPropertyDialog: React.FC<TilesetPropertyDialogProps> = (
  props,
) => {
  const classes = useStyles(props)
  const { className, ...rest } = props

  const dispatch = useDispatch()
  const open = useEditorState((state) => Boolean(state.dialog[dialogName]))
  const handleClose = () => {
    dispatch(editor.actions.closeDialog({ dialog: dialogName }))
  }
  const handleSave = (data: TilesetDef) => {
    dispatch(editor.actions.createTileset({ tilesetDef: data }))
    dispatch(editor.actions.closeDialog({ dialog: dialogName }))
  }

  const canvasRef = React.useRef<HTMLCanvasElement>()
  React.useEffect(() => {
    canvasRef.current = document.createElement('canvas')
  }, [])

  const getColorOnImg = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const ctx = canvasRef.current?.getContext('2d')
    if (canvasRef.current && ctx) {
      canvasRef.current.width = img.width
      canvasRef.current.height = img.height
      ctx.clearRect(0, 0, img.width, img.height)
      ctx.drawImage(img, 0, 0)
      const rect = img.getBoundingClientRect()
      const x = e.pageX - rect.left
      const y = e.pageY - rect.top
      const data = ctx.getImageData(x, y, 1, 1).data
      return `rgb(${data[0]},${data[1]},${data[2]})`
    }
  }

  const [focusing, setFocus] = React.useState<number | null>(null)

  return (
    <Formik initialValues={initialTileDef} onSubmit={handleSave}>
      <Dialog
        {...rest}
        onClose={handleClose}
        open={open}
        className={classNames(className, classes.root)}>
        <Form>
          <DialogTitle>Create a new tileset</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  as={TextField}
                  name="localName"
                  label="Tileset name"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  as={TextField}
                  name="image.src"
                  label="Image URL"
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  as={TextField}
                  name="gridCount.width"
                  label="Tile count horizontal"
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  as={TextField}
                  name="gridCount.height"
                  label="Tile count vertical"
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  as={TextField}
                  name="gridSize.width"
                  label="Tile width"
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  as={TextField}
                  name="gridSize.height"
                  label="Tile height"
                />
              </Grid>
              <Grid item xs={12}>
                Transparent color
                <Field name="image.transparentColor">
                  {(fieldProps: FieldProps<string[]>) => {
                    return (
                      <ColorSelector
                        {...fieldProps}
                        classes={classes}
                        focus={focusing}
                        onFocusChange={setFocus}
                      />
                    )
                  }}
                </Field>
              </Grid>
              <Grid item xs={12}>
                Preview
                <Field>
                  {({ form }: FieldProps) => (
                    <GridOverlay
                      gridCount={form.values.gridCount}
                      gridSize={form.values.gridSize}
                      clickThrough>
                      <img
                        className={classNames({
                          [classes.imgColorPick]: focusing != null,
                        })}
                        src={form.values.image.src}
                        onClick={(e) => {
                          const c = getColorOnImg(e)
                          form.setFieldValue(
                            `image.transparentColor[${focusing}]`,
                            c,
                          )
                        }}
                        alt="Tileset preview"
                      />
                    </GridOverlay>
                  )}
                </Field>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Formik>
  )
}

TilesetPropertyDialog.defaultProps = {}

export default TilesetPropertyDialog
