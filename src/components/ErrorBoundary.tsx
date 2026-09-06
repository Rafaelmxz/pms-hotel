import { Component, type ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl bg-card px-5 py-8 text-center shadow-[var(--shadow-border)]">
          <p className="font-display text-lg font-medium">Algo deu errado nesta tela.</p>
          <p className="mt-2 text-sm text-muted-foreground">Recarregue a página para tentar de novo.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
