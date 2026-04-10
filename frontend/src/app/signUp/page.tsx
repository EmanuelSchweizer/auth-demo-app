import { SignUpForm } from "@/components/Login/SignUpForm";
import { Card } from "@heroui/react";

export const SignUpPage = () => {
    return (
        <div className="h-full">
            <Card className="w-full shadow-none rounded-none sm:shadow-surface sm:rounded-3xl text-gray-900 sm:max-w-md sm:mx-auto sm:my-10">
                <Card.Header className="mb-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
                </Card.Header>
                <Card.Content className="flex flex-col items-center">
                    <SignUpForm />
                </Card.Content>
            </Card>
        </div>
    );
};

export default SignUpPage;