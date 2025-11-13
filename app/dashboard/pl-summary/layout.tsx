import { ReactNode } from 'react';

export default function PLLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Profit & Loss Dashboard</h1>
          <p className="text-muted-foreground">Financial summary and analysis</p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}