import { useUser } from "@clerk/clerk-react";
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";
import line1 from "../assets/line-2.png";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { CommandIcon, CornerDownLeft, PlusCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/authenticatedFetch";

function Create() {
    const fetchData = useFetch();
    const { isSignedIn } = useUser();
    const { theme } = useTheme();

    const [userPrompt, setUserPrompt] = useState<string>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async () => {
        if (!isSignedIn) return;

        const formData = new FormData();
        formData.append("prompt", userPrompt);
        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const response = await fetchData<{
                message: string;
                files: string[];
            }>("http://localhost:3000/api/v1/generate/thumbnail", {
                method: "POST",
                data: formData,
            });

            console.log("Upload successful:", response.data);
            alert("Uploaded: " + response.data.files.join(", "));
        } catch (error: any) {
            console.error("Error uploading files:", error);
            alert(error.response?.data?.message || "Upload failed");
        }
    };

    if (!isSignedIn) return <div>Please sign in to create a post</div>;

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
                            placeholder="Describe your thumbnail..."
                            className="w-full !border-none !outline-none resize-none !ring-0"
                            onChange={(e) => setUserPrompt(e.target.value)}
                            rows={userPrompt.split("\n").length || 1}
                        />
                        <Button
                            onClick={handleSubmit}
                            className="flex items-center gap-2"
                        >
                            Run
                            <span className="flex items-center gap-1 text-xs scale-75">
                                <CommandIcon />
                                <CornerDownLeft />
                            </span>
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

            <Input
                ref={fileRef}
                type="file"
                multiple
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
