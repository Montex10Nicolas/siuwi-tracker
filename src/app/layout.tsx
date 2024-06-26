import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Image from "next/image";
import NavBar from "~/components/NavBar";
import { Toaster } from "~/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// export const metadata = {
//   title: "Siuwi Tracker",
//   description: "The place to track all your favorite series and movies",
//   icons: [{ rel: "icon", url: "/favicon.ico" }],
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} flex min-h-screen flex-col overflow-x-hidden bg-background text-white`}
      >
        <NavBar />
        {children}
        <Toaster position="top-right" />
        <footer className="mt-auto flex h-20 w-full items-center justify-between bg-slate-800 p-6">
          <div>
            Created by <span>Nicolas Montecchiani</span>
          </div>
          <div>
            <a href="https://github.com/montex10nicolas" target="_blank">
              <Image
                src={"/github_logo.png"}
                height={50}
                width={50}
                alt="github logo"
              />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
