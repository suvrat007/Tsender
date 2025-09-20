import type { Metadata } from "next";
import "./globals.css";
import {Providers} from "../app/providers";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "tsender",
  description: "A simple transaction sender dApp",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
