import Header from "./components/Header";
import { ThemeProvider } from "./components/theme-provider";

export default function App({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex flex-col min-h-dvh w-full">
                <Header />
                <main className="max-w-7xl mx-auto p-5 flex-1 w-full">
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
}
