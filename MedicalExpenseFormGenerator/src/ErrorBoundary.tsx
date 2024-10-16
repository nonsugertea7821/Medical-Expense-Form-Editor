import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <><h1>不明なエラーが発生しました。</h1><p>エラーが解決しない場合は、発生した状況を添えてnonsugertea7821+GitPages◇gmail.comまでお問い合わせください。</p><p>※メールアドレスの「◇」を「@」に変更してください。</p></>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;