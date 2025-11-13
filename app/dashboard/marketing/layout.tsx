import { ReactNode } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Track and analyze your marketing expenses and performance</p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}