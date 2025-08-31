import { SignInButton, useUser } from "@clerk/clerk-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
    Command,
    CornerDownLeft,
    PlusCircle,
    X,
    Download,
    Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/authenticatedFetch";

import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";
import line1 from "../assets/line-2.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Create() {
    const fetchData = useFetch();
    const { isSignedIn } = useUser();
    const { theme } = useTheme();

    const [userPrompt, setUserPrompt] = useState<string>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async () => {
        if (!isSignedIn) return;

        if (userPrompt.trim() === "") {
            setError("Prompt is required");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setThumbnail(null);

        const formData = new FormData();
        formData.append("prompt", userPrompt);
        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const response = await fetchData<{
                success: boolean;
                message: string;
                image: string;
            }>(`${BACKEND_URL}/generate/thumbnail`, {
                method: "POST",
                data: formData,
            });

            if (response.data.success && response.data.image) {
                setThumbnail(response.data.image);
                setError(null);
            } else {
                setError("Failed to generate thumbnail!");
            }
        } catch (error: any) {
            console.error("Error generating thumbnail:", error);
            setError(error.response?.data?.error || "Generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadThumbnail = () => {
        if (!thumbnail) return;

        const link = document.createElement("a");
        link.href = thumbnail;
        link.download = `thumbnail-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isSignedIn) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-2">
                        Authentication Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please{" "}
                        <span className="font-medium text-teal-500">
                            <SignInButton />
                        </span>{" "}
                        to create thumbnails
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full flex-1 gap-8">
            <div>
                <img src={theme === "dark" ? logoLight : logoDark} alt="Logo" />

                <h1 className="text-md font-medium text-center">
                    We Just Simply Create Stunning{" "}
                    <span className="text-teal-500 relative">
                        Thumbnails
                        <img
                            src={line1}
                            alt="Line"
                            className="absolute right-0 mx-auto"
                        />
                    </span>
                </h1>
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-2">
                <div className="flex flex-col gap-3 w-full py-3 px-8 border border-gray-300 rounded-4xl">
                    <div className="flex items-center justify-center gap-2">
                        <textarea
                            value={userPrompt}
                            placeholder="Describe your thumbnail or give your video title/topic..."
                            className="w-full !border-none !outline-none resize-none !ring-0"
                            onChange={(e) => {
                                setUserPrompt(e.target.value);
                                setError(null);
                            }}
                            rows={userPrompt.split("\n").length || 1}
                            required
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={isGenerating || userPrompt.trim() === ""}
                            className="flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={16}
                                    />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    Run
                                    <span className="flex items-center gap-1 text-xs scale-75">
                                        <Command />
                                        <CornerDownLeft />
                                    </span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* image preview */}
                    {imageFiles.length > 0 && (
                        <div className="flex gap-2">
                            {imageFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 relative"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Uploaded image ${index + 1}`}
                                        className="h-32 object-cover rounded-xl border overflow-hidden bg-gray-200"
                                    />
                                    <span className="text-sm sr-only">
                                        {file.name}
                                    </span>

                                    <button
                                        className="absolute right-2 top-2 cursor-pointer opacity-0 hover:opacity-100 bg-gray-800/70 text-white rounded-full p-1"
                                        onClick={() => {
                                            setImageFiles((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                        }}
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-8">
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 text-sm w-fit cursor-pointer group"
                    >
                        <PlusCircle
                            className="cursor-pointer text-gray-400 group-hover:text-gray-500"
                            size={15}
                        />
                        <span className="text-gray-400 group-hover:text-gray-500">
                            Attach Images
                        </span>
                    </button>
                </div>
            </div>

            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

            <h2 className="text-lg font-semibold border p-2 rounded-xl">
                Paywall Integration Coming Tonight!
            </h2>

            {isGenerating && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="animate-spin" size={16} />
                    Creating your thumbnail...
                </div>
            )}

            {thumbnail && !isGenerating && (
                <div className="mt-4 w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">
                            Generated Thumbnail:
                        </h3>
                        <Button
                            onClick={downloadThumbnail}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Download size={14} />
                            Download
                        </Button>
                    </div>
                    <img
                        src={thumbnail}
                        alt="Generated Thumbnail"
                        className="w-full h-auto object-cover rounded-xl border overflow-hidden bg-gray-200"
                    />
                </div>
            )}

            <Input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles((prev) => [...prev, ...files]);
                }}
                className="hidden"
            />
        </div>
    );
}

export default Create;
