import CategoryTabs from "@/components/category-tabs";
import Videogrid from "@/components/Videogrid";
import { Suspense } from "react";
import Link from "next/link"; // ✅ added for navigation

export default function Home() {
  return (
    <main className="flex-1 p-4">
      {/* ✅ Downloads Button */}
      <div className="mb-4 flex justify-end">
        <Link href="/profile/downloads">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Go to Downloads
          </button>
        </Link>
      </div>

      <CategoryTabs />
      <Suspense fallback={<div>Loading videos...</div>}>
        <Videogrid />
      </Suspense>
    </main>
  );
}
