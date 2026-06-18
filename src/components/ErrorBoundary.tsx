'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('3D Showcase error:', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-[520px] bg-[#0F0F1A] border border-white/5 flex items-center justify-center">
            <div className="text-center">
              <span className="text-5xl block mb-3">🏎️</span>
              <p className="text-white/40 text-sm font-['Barlow_Condensed'] tracking-wider">
                3D viewer unavailable
              </p>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
