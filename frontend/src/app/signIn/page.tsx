import { CredentialsForm } from "@/components/SignIn/CredentialsForm";
import { GoogleSignInButton } from "@/components/SignIn/GoogleSignInButton";
import { Card } from "@heroui/react";

export const SignInPage = () => {
    return (
        <div className="h-full">
            <Card className="w-full shadow-none rounded-none sm:shadow-surface sm:rounded-3xl text-gray-900 sm:max-w-md sm:mx-auto sm:my-10">
                <Card.Header className="mb-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
                </Card.Header>
                <Card.Content className="flex flex-col items-center">
                    <GoogleSignInButton />
                    <p className="text-lg font-semibold text-center my-3 text-gray-800">
                        Or
                    </p>
                    <CredentialsForm />
                </Card.Content>
            </Card>
        </div>
    )
}

export default SignInPage;