"use client";

import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { INPUT_STYLES } from "@/constants/inputStyles";
import { useSignInForm } from "@/hooks/useSignInForm";
import { Button, Input } from "@heroui/react";

interface SignInFormProps {
    csrfToken?: string;
}

export function SignInForm(props: SignInFormProps){
    const { error, isSubmitting, handleSubmit } = useSignInForm();

    return (
        <form 
        onSubmit={(e) => void handleSubmit(e)} 
        className="w-full mt-8 text-xl text-black font-semibold flex flex-col space-y-4">
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
            {error && <span className="p-1 mb-2 text-sm font-medium text-red-700 bg-red-500/15 rounded-md">
                {error}
                </span>}
            <Button
                type="submit"
                isDisabled={isSubmitting}
                className={BUTTON_STYLES.primary}
            >
                {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
        </form>
    )
}