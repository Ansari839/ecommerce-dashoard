import { ReactNode } from 'react';

export default function RoleManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-6">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}