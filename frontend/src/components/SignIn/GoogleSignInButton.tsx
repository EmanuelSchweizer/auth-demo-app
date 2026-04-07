"use client";

import { signIn } from "next-auth/react";

export const GoogleSignInButton = () => {
    return (
        <button
            className="w-full flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            onClick={() => signIn("google")}
        >
            <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M21.805 10.0231H12V13.9771H18.805C18.205 16.6231 16.805 19.0231 14.805 19.0231C12.205 19.0231 10.205 17.0231 10.205 14.4231C10.205 11.8231 12.205 9.82312 14.805 9.82312C16.205 9.82312 17.205 10.4231 17.805 11.6231L21.805 10.0231Z"
                    fill="currentColor"
                />
                <path
                    d="M14.805 4.02312C16.905 4.02312 18.705 4.92312 19.905 6.12312L17.805 7.72312C17.205 7.32312 16.505 6.92312 14.805 6.92312C11.205 6.92312 8.20501 9.92312 8.20501 13.5231C8.20501 17.1231 11.205 20.1231 14.805 20.1231C18.405 20.1231 21.405 17.1231 21.405 13.5231C21.405 12.9231 21.305 12.3231 21.205 11.9231H14.805V9.82312Z"
                    fill="currentColor"
                />
            </svg>
            Sign in with Google
        </button>
    );
}