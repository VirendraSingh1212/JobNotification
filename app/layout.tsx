import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Job Notification App",
  description: "Premium job notification platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        <MainNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
