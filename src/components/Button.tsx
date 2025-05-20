import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "contained" | "outlined" | "text";
    size?: "small" | "medium" | "large";
    loading?: boolean;
    fullWidth?: boolean;
    color?: "success" | "error" | "info" | "primary";
    customColor?: boolean;
}

export default function Button({
    children,
    variant = "contained",
    size = "medium",
    loading = false,
    fullWidth = false,
    color = "primary",
    customColor,
    className,
    ...props
}: ButtonProps) {
    const colors = {
        primary: {
            contained: {
                border: "border-primary",
                bg: "bg-primary",
                hover: "hover:bg-primary-hover",
                active: "active:bg-primary-800",
                text: "text-on-primary",
            },
            outlined: {
                border: "border-primary",
                text: "text-primary",
                hover: "hover:bg-primary-container",
            },
            text: {
                text: "text-primary",
                hover: "hover:text-primary-hover",
            },
        },
        success: {
            contained: {
                border: "border-success",
                bg: "bg-success",
                hover: "hover:bg-success-hover",
                active: "active:bg-success-800",
                text: "text-on-success",
            },
            outlined: {
                border: "border-success",
                text: "text-success",
                hover: "hover:bg-success-container",
            },
            text: {
                text: "text-success",
                hover: "hover:text-success-hover",
            },
        },
        error: {
            contained: {
                border: "border-error",
                bg: "bg-error",
                hover: "hover:bg-error-hover",
                active: "active:bg-error-800",
                text: "text-on-error",
            },
            outlined: {
                border: "border-error",
                text: "text-error",
                hover: "hover:bg-error-container",
            },
            text: {
                text: "text-error",
                hover: "hover:text-error-hover",
            },
        },
        info: {
            contained: {
                border: "border-info",
                bg: "bg-info",
                hover: "hover:bg-info-hover",
                active: "active:bg-info-800",
                text: "text-on-info",
            },
            outlined: {
                border: "border-info",
                text: "text-info",
                hover: "hover:bg-info-container",
            },
            text: {
                text: "text-info",
                hover: "hover:text-info-hover",
            },
        },
    };

    return (
        <button
            className={clsx(
                "relative overflow-hidden rounded-md font-medium transition-all duration-300 focus:outline-none hover:cursor-pointer",
                "inline-flex items-center justify-center",
                fullWidth && "w-full",
                !customColor &&
                    variant === "contained" && [
                        colors[color].contained.border,
                        colors[color].contained.bg,
                        colors[color].contained.text,
                        colors[color].contained.hover,
                        colors[color].contained.active,
                        "shadow-md",
                    ],
                !customColor &&
                    variant === "outlined" && [
                        colors[color].outlined.border,
                        colors[color].outlined.text,
                        colors[color].outlined.hover,
                        "border",
                    ],
                !customColor && variant === "text" && [colors[color].text.text, colors[color].text.hover],
                size === "small" && "px-6 py-2 text-base",
                size === "medium" && "px-8 py-2 text-lg",
                size === "large" && "px-12 py-3 text-xl",
                className,
            )}
            disabled={loading || props.disabled}
            {...props}
        >
            {!customColor && (
                <span
                    className={
                        "absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                    }
                ></span>
            )}
            {loading ? (
                <LoadingSpinner
                    size={size === "small" ? "small" : "medium"}
                    color={variant === "contained" ? "onPrimary" : "primary"}
                    className="animate-spin"
                />
            ) : (
                children
            )}
        </button>
    );
}
