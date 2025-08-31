"use client";

import * as React from "react";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { ModeToggle } from "./ui/mode-toggle";
import { useTheme } from "./theme-provider";

const components: { title: string; to: string; description: string }[] = [
    {
        title: "Alert Dialog",
        to: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        to: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        to: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        to: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        to: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        to: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
];

function Header() {
    const { theme } = useTheme();
    return (
        <nav className="w-full border-b bg-background/50 backdrop-blur-sm flex justify-between items-center px-4 py-2">
            <Link to="/">
                <img
                    src={theme === "dark" ? logoLight : logoDark}
                    alt="Thumbnail Lelo"
                    className="h-10 w-auto"
                />
            </Link>

            <HeaderMenu />

            <div className="flex items-center gap-4">
                <ModeToggle />
                <SignedIn>
                    <UserButton showName />
                </SignedIn>
                <SignedOut>
                    <Button variant="outline">
                        <SignInButton />
                    </Button>
                </SignedOut>
            </div>
        </nav>
    );
}

function HeaderMenu() {
    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link to="/">Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link to="/create">Create Thumbnail</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function ListItem({
    title,
    children,
    to,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link to={to}>
                    <div className="text-sm leading-none font-medium">
                        {title}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

export default Header;
