import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/context/ToastProvider";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import 'leaflet/dist/leaflet.css';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kavach",
  description: "Crime Analytics and Hotspot Mapping System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <NavbarWrapper />
            {children}
          </GoogleOAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
