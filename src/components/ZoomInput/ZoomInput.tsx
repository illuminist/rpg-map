import _ from 'lodash'
import * as React from 'react'
import useStyles from './styles'

import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'

export interface IZoomInputProps {
  classes?: object
  className?: string
  onChange?: (value: number) => void
  value: number
  height?: number
  min?: number
  label?: string
}

export const ZoomInput: React.FC<IZoomInputProps> = props => {
  const classes = useStyles(props)
  const { className, value, onChange, label, min = 0.1 } = props

  const [internalValue, setInternalValue] = React.useState(value)
  const [internalChanged, setInternalChanged] = React.useState(false)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      const numVal = v.endsWith('%') ? v.substring(0, v.length - 1) : v
      const numVal2 = Math.max(min, Math.round(Number(numVal)) / 100)
      setInternalValue(numVal2)
      setInternalChanged(true)
    },
    [min],
  )

  const handleBlur = React.useCallback(() => {
    if (internalChanged) onChange && onChange(internalValue)
    setInternalChanged(false)
  }, [onChange, internalValue, internalChanged])

  const handleInputKey = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleBlur()
    },
    [handleBlur],
  )

  const handleZoomIn = React.useCallback(() => {
    onChange && onChange(value + 0.1)
  }, [value, onChange])

  const handleZoomOut = React.useCallback(() => {
    onChange && onChange(value - 0.1)
  }, [value, onChange])

  const InputProps = React.useMemo(
    () => ({
      classes,
      startAdornment: (
        <InputAdornment position="start">
          <IconButton disabled={value <= min + 0.0001} onClick={handleZoomOut}>
            <ZoomOutIcon />
          </IconButton>
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleZoomIn}>
            <ZoomInIcon />
          </IconButton>
        </InputAdornment>
      ),
    }),
    [classes, value, min, handleZoomIn, handleZoomOut],
  )

  return (
    <TextField
      className={className}
      value={Math.floor((internalChanged ? internalValue : value) * 100) + '%'}
      variant="outlined"
      InputProps={InputProps}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyPress={handleInputKey}
      label={label}
    />
  )
}

ZoomInput.defaultProps = {}

export default ZoomInput
