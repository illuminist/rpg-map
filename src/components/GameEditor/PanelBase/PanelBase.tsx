import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

export interface PanelBaseProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  title?: string
}

export const PanelBase: React.FC<PanelBaseProps> = (props) => {
  const classes = useStyles(props)
  const { className, title, children } = props

  return (
    <Card elevation={8} className={classNames(className, classes.root)}>
      {title && <CardHeader title={title || 'unnamedpanel'} />}
      {children}
    </Card>
  )
}

PanelBase.defaultProps = {}

export default PanelBase
