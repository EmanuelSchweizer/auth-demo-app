import Link from "next/link";

export const NavBar = () => {
  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">Shopping List</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">About</Link>
            <Link href="/contact" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}