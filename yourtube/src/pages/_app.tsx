import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { ThemeProvider } from "@/Context/ThemeContext"; // ✅ Added ThemeProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider> {/* Wraps app to apply auto-theme based on time */}
        <div className="min-h-screen bg-white text-black">
          <title>Your-Tube Clone</title>
          <Header />
          <Toaster />
          <div className="flex">
            <Sidebar />
            <Component {...pageProps} />
          </div>
        </div>
      </ThemeProvider>
    </UserProvider>
  );
}
