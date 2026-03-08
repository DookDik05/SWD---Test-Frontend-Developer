'use client';
import Navbar from "@/components/Navbar";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
