import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ErrorStateProps {
    error: unknown;
    onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-card rounded-xl p-8 shadow-soft border border-border/50 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {errorMessage || "An unexpected error occurred"}
                    </p>
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            className="gradient-primary text-primary-foreground gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
