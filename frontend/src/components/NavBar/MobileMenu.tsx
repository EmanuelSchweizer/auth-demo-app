"use client";

import Link from "next/link";
import { navLinks } from "./navLinks";
import { Button } from "@heroui/react";
import { IoCloseOutline } from "react-icons/io5";

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center space-y-8">
      <Button
        variant="ghost"
        className="absolute top-5 right-5 text-gray-800 focus:outline-none hover:text-violet-800"
        aria-label="Menü schließen"
        onClick={onClose}
      >
        <IoCloseOutline className="w-10 h-10" />
      </Button>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-3xl font-semibold text-gray-800 hover:text-violet-800"
          onClick={onClose}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};
