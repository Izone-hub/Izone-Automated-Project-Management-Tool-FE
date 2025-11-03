/**
 * Auth Layout - Shared layout for authentication pages
 * Optimizes navigation between login/signup pages by providing shared layout structure
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

