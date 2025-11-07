import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { Navbar } from "@/components/sections/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DoP IA | Automatize 80% do seu Atendimento com IA",
  description: "Atenda seus clientes 24/7 via WhatsApp, Telegram e Instagram com inteligência artificial. Reduza custos e aumente satisfação. Teste grátis por 14 dias.",
  keywords: ["atendimento automático", "chatbot", "whatsapp bot", "ia", "automação", "dop ia"],
  authors: [{ name: "DoP IA" }],
  openGraph: {
    title: "DoP IA | Automatize seu Atendimento",
    description: "Automatize 80% do seu atendimento com IA. Teste grátis por 14 dias.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoP IA - E-commerce Inteligente",
    description: "Automatize 80% do seu atendimento com IA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR" className="scroll-smooth">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </head>
        <body className={`${inter.className} antialiased pt-20`}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
