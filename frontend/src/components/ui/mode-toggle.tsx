import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div>
            {theme === "light" && (
                <Button
                    variant="link"
                    size="icon"
                    onClick={() => setTheme("dark")}
                >
                    <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <span className="sr-only">Toggle light theme</span>
                </Button>
            )}
            {theme === "dark" && (
                <Button
                    variant="link"
                    size="icon"
                    onClick={() => setTheme("light")}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle dark theme</span>
                </Button>
            )}
        </div>
    );
}
