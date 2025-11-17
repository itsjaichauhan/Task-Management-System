// frontend/app/auth/layout.tsx
import { redirect } from 'next/navigation';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>{children}</div>
  );
}
