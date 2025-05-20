import { ReactNode } from "react";
import { clsx } from "clsx";

interface Props {
    children: ReactNode;
    size?: "small" | "medium" | "large";
    className?: string;
}

export default function Icon({ children, size = "medium", className }: Props) {
    const sizeClasses = {
        small: "w-5 h-5",
        medium: "w-6 h-6",
        large: "w-7 h-7",
    };

    return (
        <span className={clsx("inline-flex items-center justify-center", sizeClasses[size], className)}>
            {children}
        </span>
    );
}
