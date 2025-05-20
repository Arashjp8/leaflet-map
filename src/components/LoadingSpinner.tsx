import LoaderIcon from "../assets/icons/LoaderIcon";
import Icon from "./Icon";

interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large" | "xlarge" | "xxlarge";
    color?: "primary" | "onPrimary" | "error" | "success";
    className?: string;
}

const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-7 h-7",
    large: "w-10 h-10",
    xlarge: "w-14 h-14",
    xxlarge: "w-18 h-18",
};

const colorClasses = {
    primary: "text-primary",
    onPrimary: "text-on-primary",
    error: "text-error",
    success: "text-success",
};

export default function LoadingSpinner({ size = "medium", color = "primary", className = "" }: LoadingSpinnerProps) {
    return (
        <span className={"flex justify-center items-center animate-spin"}>
            <Icon size={"medium"} className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
                <LoaderIcon />
            </Icon>
        </span>
    );
}
