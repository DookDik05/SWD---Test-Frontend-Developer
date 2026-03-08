import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "SWD Frontend Test",
  description: "SWD Frontend Developer Test",
};

import RootLayoutContent from "@/app/RootLayoutContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <Providers>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  );
}
