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
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    to={component.to}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                    >
                        <Link to="/docs">Docs</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>List</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link to="#">
                                        <div className="font-medium">
                                            Components
                                        </div>
                                        <div className="text-muted-foreground">
                                            Browse all components in the
                                            library.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link to="#">
                                        <div className="font-medium">
                                            Documentation
                                        </div>
                                        <div className="text-muted-foreground">
                                            Learn how to use the library.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link to="#">
                                        <div className="font-medium">Blog</div>
                                        <div className="text-muted-foreground">
                                            Read our latest blog posts.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link to="#">Components</Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link to="#">Documentation</Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link to="#">Blocks</Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="#"
                                        className="flex-row items-center gap-2"
                                    >
                                        <CircleHelpIcon />
                                        Backlog
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="#"
                                        className="flex-row items-center gap-2"
                                    >
                                        <CircleIcon />
                                        To Do
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="#"
                                        className="flex-row items-center gap-2"
                                    >
                                        <CircleCheckIcon />
                                        Done
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
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
