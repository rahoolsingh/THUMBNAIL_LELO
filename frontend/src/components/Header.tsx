"use client";

import * as React from "react";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
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

export default Header;
