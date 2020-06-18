import * as React from 'react'

export interface IErrorBoundaryProps<Props> {
  fallback: React.ReactNode | React.ComponentType<Props & { error: Error }>
}

class ErrorBoundary<Props = {}> extends React.Component<
  IErrorBoundaryProps<Props>,
  { hasError: boolean; error?: Error }
> {
  constructor(props: IErrorBoundaryProps<Props>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    const { fallback, children } = this.props

    if (this.state.hasError) {
      if (typeof fallback === 'function') {
        const FallbackComponent = fallback as React.ComponentType<any>
        return <FallbackComponent {...this.props} error={this.state.error} />
      }
      return fallback
    }

    return children
  }
}

export default ErrorBoundary
