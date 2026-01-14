import { Loader2 } from "lucide-react";

interface LoadingStateProps {
    message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                </div>
                <p className="text-lg font-medium text-foreground">{message}</p>
            </div>
        </div>
    );
}
