import React from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import DynamicProvider from "@/providers/dynamic-provider";
import {Inter as FontSans} from "next/font/google";

import {cn} from "@/lib/utils";
import Navbar from "@/components/app-components/navbar";
import {Toaster} from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Wager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <DynamicProvider>
          <Navbar />
          {children}
        </DynamicProvider>
        <Toaster />
        <div className="fixed top-0 left-0 w-full h-full bg-gray-400  z-50 hidden md:block">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-black">
              Please use a mobile device to view this page
            </h2>
          </div>
        </div>
      </body>
    </html>
  );
}
