import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rebook It — Admin Panel",
  description: "Admin dashboard for Rebook It C2C marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background">
        {children}
      </body>
    </html>
  );
}
