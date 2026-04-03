import { Toaster } from "sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-linear-to-br from-black to-red-950">
      <Toaster />
      {children}
    </div>
  );
}
