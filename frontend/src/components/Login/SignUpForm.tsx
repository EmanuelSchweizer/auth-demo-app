"use client";

import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { INPUT_STYLES } from "@/constants/inputStyles";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { Button, Input } from "@heroui/react";
import Link from "next/link";

export function SignUpForm() {
    const { error, isSubmitting, handleSubmit, passwordRulesMessage } = useSignUpForm();

    return (
        <form
            onSubmit={(e) => void handleSubmit(e)}
            className="w-full mt-6 text-xl text-black font-semibold flex flex-col space-y-4"
        >
            <Input
                type="text"
                name="name"
                placeholder="Name"
                className={INPUT_STYLES.primary}
            />
            <Input
                type="email"
                name="email"
                placeholder="Email"
                className={INPUT_STYLES.primary}
            />
            <Input
                type="password"
                name="password"
                placeholder="Password"
                className={INPUT_STYLES.primary}
            />
            <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className={INPUT_STYLES.primary}
            />
            <p className="text-xs font-medium text-gray-600">
                {passwordRulesMessage}
            </p>
            {error && (
                <span className="p-1 mb-2 text-sm font-medium text-red-700 bg-red-500/15 rounded-md">
                    {error}
                </span>
            )}
            <Button type="submit" isDisabled={isSubmitting} className={BUTTON_STYLES.primary}>
                {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center font-medium text-gray-700">
                Already have an account?{" "}
                <Link href="/signIn" className="text-violet-700 hover:text-violet-600 underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
}