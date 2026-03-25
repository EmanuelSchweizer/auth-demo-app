import { toast } from "@heroui/react";

type AppToastVariant = "success" | "warning" | "danger";

const defaultActionProps = {
    children: "Dismiss",
    onPress: () => toast.clear(),
    variant: "tertiary" as const,
};

const showToast = (title: string, description: string, variant: AppToastVariant) => {
    toast(title, {
        actionProps: defaultActionProps,
        description,
        variant,
    });
};

export const showSuccessToast = (description: string) => {
    showToast("Success", description, "success");
};

export const showWarningToast = (description: string) => {
    showToast("Warning", description, "warning");
};

export const showErrorToast = (description: string) => {
    showToast("Error", description, "danger");
};
