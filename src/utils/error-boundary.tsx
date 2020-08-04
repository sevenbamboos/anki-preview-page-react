import React, {ReactNode} from 'react';

type ErrorBoundaryProps = {
  fallback: ReactNode,
  children: ReactNode
};

type ErrorBoundaryState = {
  isError: boolean;
};

const showBoundary = true;

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props : ErrorBoundaryProps) {
    super(props);
    this.state = {isError: false};
  }

  static getDerivedStateFromError(error: any) {
    return {isError: true};
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.isError) {
      return this.props.fallback;
    }

    return (
      <>
        {showBoundary && (<div><h4>error boundary start:</h4></div>)}
        {this.props.children}
        {showBoundary && (<div><h4>:error boundary end</h4></div>)}
      </>
    );
  }
}