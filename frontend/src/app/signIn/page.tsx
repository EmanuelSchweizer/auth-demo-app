import { CredentialsForm } from "@/components/SignIn/CredentialsForm";
import { GoogleSignInButton } from "@/components/SignIn/GoogleSignInButton";

export const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                <GoogleSignInButton />
                <span className="text-2xl font-semibold text-center">
                    Or
                </span>
                <CredentialsForm />
            </div>
        </div>
    )
}

export default SignInPage;