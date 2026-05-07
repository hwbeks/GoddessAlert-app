import { Component } from "react";
import { T, css } from "../theme";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("GoddessAlert ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "48px 24px",
          textAlign: "center",
          maxWidth: 360,
          margin: "0 auto",
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚡</div>
          <div style={{
            fontSize: 18,
            color: T.accent,
            fontStyle: "italic",
            marginBottom: 12,
            lineHeight: 1.3,
          }}>
            Something went wrong.
          </div>
          <div style={{
            fontSize: 13,
            color: T.muted,
            lineHeight: 1.7,
            marginBottom: 28,
          }}>
            This section ran into an unexpected problem. The rest of the app is still working.
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              ...css.btnGhost,
              width: "auto",
              padding: "12px 28px",
              fontSize: 11,
              letterSpacing: 2,
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
