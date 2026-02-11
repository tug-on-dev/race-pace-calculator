"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor, Globe, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-4xl items-center px-4">
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {t("calculator")}
          </Link>
          <Link
            href="/splits"
            className={`transition-colors hover:text-foreground ${
              pathname === "/splits"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {t("splits")}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("language")}>
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={pathname} locale="en">
                  English
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={pathname} locale="fr">
                  Français
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("theme")}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                {t("light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                {t("dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                {t("system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-2">
          <Link
            href="/"
            className={`block text-sm font-medium transition-colors hover:text-foreground ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {t("calculator")}
          </Link>
          <Link
            href="/splits"
            className={`block text-sm font-medium transition-colors hover:text-foreground ${
              pathname === "/splits"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {t("splits")}
          </Link>
        </div>
      )}
    </header>
  );
}
