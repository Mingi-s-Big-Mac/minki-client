import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 렌더 중 예외가 나도 앱 전체가 하얗게 뜨지 않도록 잡아주는 경계.
 * (예: AI 답변의 예상 못 한 필드로 렌더가 깨지는 경우.)
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[ErrorBoundary]", error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-[15px] font-semibold text-porcelain">
          화면을 표시하는 중 문제가 생겼어요.
        </p>
        <p className="text-[13px] text-ink-subtle">
          잠시 후 다시 시도하거나 페이지를 새로고침해 주세요.
        </p>
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-sm border border-line-outline px-[17px] py-[10px] text-[13px] font-semibold text-porcelain transition-colors hover:border-ink-subtle"
          >
            다시 시도
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-sm bg-primary px-[17px] py-[10px] text-[13px] font-bold text-brand-ink transition-colors hover:bg-primary-light"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }
}
