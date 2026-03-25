"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "./navLinks";
import { MobileMenu } from "./MobileMenu";
import { IoMenuOutline } from "react-icons/io5";
import { Button } from "@heroui/react";
import { FaBasketShopping } from "react-icons/fa6";

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky inset-x-0 top-0 z-10 border-b border-gray-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800 flex items-center">
                <div className="flex items-center text-white bg-violet-800/50 rounded-full w-8 h-8 justify-center">
                  <FaBasketShopping className="w-5 h-5" />
                </div>
                <span className="ml-2">Shopping List</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center h-full space-x-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="h-full flex items-center border-b-2 border-transparent hover:border-violet-800 hover:text-violet-800 text-gray-800"
                >
                  {label}
                </Link>
              ))}
            </div>
            <Button
              variant="ghost"
              className="md:hidden text-gray-800 focus:outline-none hover:text-violet-800"
              aria-label="Menü öffnen"
              onClick={() => setMenuOpen(true)}
            >
              <IoMenuOutline className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </nav>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}