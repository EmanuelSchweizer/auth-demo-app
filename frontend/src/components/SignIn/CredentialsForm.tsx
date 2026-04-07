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
        onSubmit={handleSubmit} 
        className="w-full mt-8 text-xl text-black font-semibold flex flex-col">
            {error && <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
                {error}
                </span>}
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
                Log In
            </button>
        </form>
    )
}