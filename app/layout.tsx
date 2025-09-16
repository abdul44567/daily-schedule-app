import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { PopupProvider } from "./components/PopupContext";

export const metadata: Metadata = {
  title: "My Daily Schedule",
  description: "Personal schedule app",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        <PopupProvider>
          <Header />
          {children}
          <Footer />
        </PopupProvider>
      </body>
    </html>
  );
}
