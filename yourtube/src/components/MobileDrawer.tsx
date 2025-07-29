// components/MobileDrawer.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Menu
        className="w-6 h-6 text-black cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex z-50">
          <Dialog.Panel className="w-64 bg-white text-black h-full p-0 overflow-y-auto">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setIsOpen(false)}
                className="text-black font-semibold"
              >
                ✕
              </button>
            </div>
            <Sidebar /> {/* ✅ Uses the actual Sidebar */}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
