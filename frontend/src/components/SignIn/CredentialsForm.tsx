"use client";

import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { INPUT_STYLES } from "@/constants/inputStyles";
import { Button, Input } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CredentialsFormProps {
    csrfToken?: string;
}

export function CredentialsForm(props: CredentialsFormProps){
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const signInResponse = await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirect: false,
        });
        
        if (signInResponse?.error) {
            setError("Invalid email or password.");
        } else {
            router.push("/");
        }
    }

    return (
        <form 
        onSubmit={(e) => handleSubmit(e)} 
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
                className={BUTTON_STYLES.primary}
            >
                Log In
            </Button>
        </form>
    )
}