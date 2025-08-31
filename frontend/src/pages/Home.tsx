import { SignIn, SignInButton, useUser } from "@clerk/clerk-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Play } from "lucide-react";

// Mock assets - replace with your actual imports
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";
import line1 from "../assets/line-2.png";
import { useNavigate } from "react-router";

function Home() {
    const { isSignedIn, user } = useUser();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/create");
    };

    return (
        <div className="flex flex-col items-center justify-center h-full flex-1 gap-8">
            {/* Header */}
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

            {/* Hero Section */}
            <div className="w-full max-w-2xl text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Transform your content with AI-powered thumbnail generation.
                    Create eye-catching visuals that boost your video engagement
                    in seconds.
                </p>

                <div>
                    {isSignedIn ? (
                        <div className="space-y-3 mx-auto flex flex-col justify-center items-center">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Welcome back, {user?.firstName || "Creator"}!
                            </p>
                            <Button
                                onClick={handleGetStarted}
                                className="flex items-center gap-2"
                            >
                                Start Creating
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3 mx-auto flex flex-col justify-center items-center">
                            <Button className="flex items-center gap-2">
                                <SignInButton />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Grid */}
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="flex flex-col items-center text-center p-4 border border-gray-300 rounded-xl">
                    <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg mb-3">
                        <Sparkles className="text-teal-500" size={20} />
                    </div>
                    <h3 className="font-medium text-sm mb-1">AI-Powered</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Advanced AI creates thumbnails that match your vision
                    </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-gray-300 rounded-xl">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                        <Zap className="text-blue-500" size={20} />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Lightning Fast</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Generate professional thumbnails in just seconds
                    </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-gray-300 rounded-xl">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-3">
                        <Play className="text-purple-500" size={20} />
                    </div>
                    <h3 className="font-medium text-sm mb-1">16:9 Perfect</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Optimized for YouTube and all video platforms
                    </p>
                </div>
            </div>

            {/* How it works */}
            <div className="w-full max-w-2xl mt-8">
                <h2 className="text-center font-medium text-sm mb-6">
                    How it works
                </h2>

                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            1
                        </div>
                        <div>
                            <h3 className="font-medium text-sm mb-1">
                                Describe Your Thumbnail
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Tell us what you want - colors, style, elements,
                                or mood
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            2
                        </div>
                        <div>
                            <h3 className="font-medium text-sm mb-1">
                                Add Reference Images (Optional)
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Upload images to guide the AI's creative process
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            3
                        </div>
                        <div>
                            <h3 className="font-medium text-sm mb-1">
                                Download & Use
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Get your thumbnail in seconds and boost your
                                content
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="w-full max-w-2xl mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="font-medium text-lg text-teal-500">
                            10K+
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Thumbnails Created
                        </div>
                    </div>
                    <div>
                        <div className="font-medium text-lg text-teal-500">
                            5K+
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Happy Creators
                        </div>
                    </div>
                    <div>
                        <div className="font-medium text-lg text-teal-500">
                            98%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Satisfaction Rate
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            {!isSignedIn && (
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                    Ready to create stunning thumbnails?{" "}
                    <button
                        onClick={handleGetStarted}
                        className="text-teal-500 hover:text-teal-600 underline"
                    >
                        Sign up now
                    </button>
                </div>
            )}
        </div>
    );
}

export default Home;
