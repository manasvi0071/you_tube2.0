import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/lib/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="bg-black text-white min-h-screen">
          <Header />
          <div className="flex flex-col md:flex-row">
            {/* Sidebar only visible on md+ screens */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* Main content area that adapts */}
            <main className="flex-1 px-2 md:px-4">
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      </ThemeProvider>
    </UserProvider>
  );
}
