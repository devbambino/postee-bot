import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/nabvar";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Postee Bot v1",
  description: "Posting engaging content to social networks has never been easier thanks to PosteeBot powerful AI!!!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Toaster position="bottom-center" />
        {children}
      </body>
      <GoogleAnalytics gaId="" />
    </html>
  );
}
