import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error caught by boundary:', error)
    console.error('Component stack:', errorInfo.componentStack)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%)',
            padding: '20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '48px 40px',
              maxWidth: '560px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>⚠️</div>

            <h1
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a202c',
                marginBottom: '12px'
              }}
            >
              Oops! Something went wrong
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: '#718096',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}
            >
              We're sorry, but something unexpected happened. Please try again or
              contact support if the problem persists.
            </p>

            {this.state.error && (
              <details
                style={{
                  background: '#f7fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#4a5568',
                  cursor: 'pointer'
                }}
              >
                <summary style={{ fontWeight: '700', marginBottom: '8px' }}>
                  🔍 Technical Details
                </summary>
                <pre
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '11px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    color: '#c53030'
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                onClick={this.handleReload}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                  fontFamily: 'inherit'
                }}
              >
                🔄 Reload Page
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  padding: '14px 28px',
                  background: 'white',
                  color: '#4a5568',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary