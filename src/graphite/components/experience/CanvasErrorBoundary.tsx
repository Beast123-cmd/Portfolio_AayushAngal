import { Component, type ErrorInfo, type ReactNode } from "react";

interface CanvasErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error, info: ErrorInfo) => void;
}

interface CanvasErrorBoundaryState {
  failed: boolean;
}

export class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  state: CanvasErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError(error, info);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
