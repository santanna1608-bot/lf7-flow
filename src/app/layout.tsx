import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  title: "LF7 AI Flow - CRM & AI Monitoring",
  description: "SaaS para gestão de leads e monitoramento de Funcionários IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", jakarta.className)}>
        {children}
      </body>
    </html>
  );
}
