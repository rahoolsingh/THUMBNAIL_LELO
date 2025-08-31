import { useTheme } from "@/components/theme-provider";
import { Clock, Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";
import line1 from "../assets/line-2.png";

function UnderDevelopment() {
    const { theme } = useTheme();

    const handleGoBack = () => {
        // Navigate back or to home page
        console.log("Navigate back to home");
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

            {/* Under Development Message */}
            <div className="w-full max-w-2xl flex flex-col gap-6">
                <div className="flex flex-col gap-4 w-full py-8 px-8 border border-gray-300 rounded-4xl text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-2">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
                            <Wrench className="text-gray-500" size={32} />
                        </div>
                    </div>

                    {/* Main Message */}
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Under Development
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        We're working hard to bring you something amazing. This
                        feature is temporarily unavailable.
                    </p>

                    {/* Time Notice */}
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <Clock className="text-teal-500" size={16} />
                        <span className="text-sm text-teal-500 font-medium">
                            Please check back tomorrow
                        </span>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-teal-500 h-2 rounded-full w-3/4"></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Development Progress: 75%
                        </p>
                    </div>
                </div>

                {/* What's Coming */}
                <div className="px-8">
                    <h3 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">
                        What's Coming Soon:
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                            Enhanced AI thumbnail generation
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                            Multiple style templates
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                            Affordable pricing plans
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                {/* <div className="px-8">
                    <Button
                        onClick={handleGoBack}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Go Back Home
                    </Button>
                </div> */}
            </div>

            {/* Footer Message */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 max-w-md">
                Thank you for your patience while we improve your experience.
                Follow us for updates on new features and improvements.
            </div>
        </div>
    );
}

export default UnderDevelopment;
