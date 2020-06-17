import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'

export type EditorTextFieldProps = TextFieldProps & {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  onUpdate?: (value: string) => void
}

export const EditorTextField = (props: EditorTextFieldProps) => {
  const classes = useStyles(props)
  const { className, onUpdate, ...restProp } = props

  const [isEditing, setEditing] = React.useState(false)
  const [editedValue, setEditedValue] = React.useState('')

  const propRef = React.useRef(props)
  propRef.current = props
  const handleFocus = React.useCallback(() => {
    setEditing(true)
    setEditedValue(propRef.current.value! as string)
  }, [])
  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setEditing(false)
      propRef.current.onUpdate?.(e.target.value)
    },
    [],
  )
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedValue(e.target.value)
    },
    [],
  )
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onUpdate?.((e.target as HTMLInputElement).value)
      }
      props.onKeyDown?.(e)
    },
    [props.onKeyDown, onUpdate],
  )

  return (
    <TextField
      {...restProp}
      className={classNames(className, classes.root)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={isEditing ? editedValue : props.value}
    />
  )
}

EditorTextField.defaultProps = {}

export default EditorTextField
