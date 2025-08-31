import { useUser } from "@clerk/clerk-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { CommandIcon, CornerDownLeft, PlusCircle, X, Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/authenticatedFetch";

// Mock assets - replace with your actual imports
const logoDark = "/api/placeholder/200/60";
const logoLight = "/api/placeholder/200/60";
const line1 = "/api/placeholder/100/20";

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
        
        const link = document.createElement('a');
        link.href = thumbnail;
        link.download = `thumbnail-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearAll = () => {
        setUserPrompt("");
        setImageFiles([]);
        setThumbnail(null);
        setError(null);
    };

    if (!isSignedIn) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please sign in to create thumbnails</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <img 
                        src={theme === "dark" ? logoLight : logoDark} 
                        alt="Logo" 
                        className="mx-auto h-16 w-auto"
                    />
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Create Stunning{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 relative">
                                Thumbnails
                                <img
                                    src={line1}
                                    alt="Line"
                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-60"
                                />
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Generate eye-catching thumbnails for your videos using AI. Simply describe what you want or upload reference images.
                        </p>
                    </div>
                </div>

                {/* Main Input Area */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 space-y-4">
                        {/* Prompt Input */}
                        <div className="relative">
                            <textarea
                                value={userPrompt}
                                placeholder="Describe your perfect thumbnail... (e.g., 'A cat typing on a keyboard with neon lights and futuristic background')"
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                onChange={(e) => {
                                    setUserPrompt(e.target.value);
                                    setError(null);
                                }}
                                rows={Math.max(2, userPrompt.split("\n").length)}
                                required
                            />
                        </div>

                        {/* Image Preview Grid */}
                        {imageFiles.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                {imageFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-square overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-teal-400 transition-colors duration-200"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Reference ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                                        <button
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                                            onClick={() => {
                                                setImageFiles((prev) =>
                                                    prev.filter((_, i) => i !== index)
                                                );
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                                            {file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-200 group"
                            >
                                <PlusCircle 
                                    className="group-hover:scale-110 transition-transform duration-200" 
                                    size={16} 
                                />
                                Add Reference Images
                            </button>

                            <div className="flex items-center gap-3">
                                {(userPrompt || imageFiles.length > 0) && (
                                    <Button
                                        variant="outline"
                                        onClick={clearAll}
                                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                    >
                                        Clear All
                                    </Button>
                                )}
                                
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isGenerating || userPrompt.trim() === ""}
                                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-medium px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            Generate
                                            <span className="flex items-center gap-1 text-xs opacity-75">
                                                <CommandIcon size={12} />
                                                <CornerDownLeft size={12} />
                                            </span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-red-700 dark:text-red-400 font-medium">Error</span>
                        </div>
                        <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isGenerating && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={24} />
                            <div className="text-center">
                                <p className="text-blue-700 dark:text-blue-300 font-medium">Creating your thumbnail...</p>
                                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">This may take a few moments</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Generated Thumbnail */}
                {thumbnail && !isGenerating && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Your Thumbnail
                                </h3>
                                <Button
                                    onClick={downloadThumbnail}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Download size={16} />
                                    Download
                                </Button>
                            </div>
                            
                            <div className="relative group">
                                <img
                                    src={thumbnail}
                                    alt="Generated Thumbnail"
                                    className="w-full h-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => {
                                        setThumbnail(null);
                                        setUserPrompt("");
                                    }}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Create Another
                                </Button>
                                
                                <Button
                                    onClick={downloadThumbnail}
                                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
                                >
                                    <Download size={16} className="mr-2" />
                                    Save Thumbnail
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <Input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                    const files = Array.from(e.target.files || []).filter(file => 
                        file.type.startsWith('image/')
                    );
                    if (files.length !== (e.target.files?.length || 0)) {
                        setError("Only image files are allowed");
                    }
                    setImageFiles((prev) => [...prev, ...files]);
                }}
                className="hidden"
            />
        </div>
    );
}

export default Create;