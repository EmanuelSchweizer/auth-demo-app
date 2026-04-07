"use client";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { FcGoogle } from "react-icons/fc";

import { signIn } from "next-auth/react";
import { Button } from "@heroui/react";

export const GoogleSignInButton = () => {
    return (
        <Button
            variant="primary"
            className={BUTTON_STYLES.google}
            onClick={() => signIn("google")}
        >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
        </Button>
    );
}