interface ErrorMessageProps {
    error: string | null;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
    if (!error) return null;

    return (
        <div className="absolute z-10 top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
        </div>
    );
}
