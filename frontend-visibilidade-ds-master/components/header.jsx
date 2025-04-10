"use client"

import { Moon, SidebarIcon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const [displayNone, setDisplayNone] = useState(false);

  const getPageTitle = () => {
    const nameByPath = {
      "/dashboard": "Página inicial",
      "/postagens": "Postagens",
      "/agendamento": "Agendamento",
    }

    if (pathname.startsWith("/postagens/template/")) {
      return "Editar Template";
    }

    if (pathname.startsWith("/postagens/editar/")) {
      return "Editar Post";
    }

    if (pathname.startsWith("/agendamento/")) {
      return "Agendamento";
    }

    return nameByPath[pathname] || pathname.split("/").pop().charAt(0).toUpperCase() + pathname.split("/").pop().slice(1)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const userEmail = localStorage.getItem("user_email");
    setDisplayNone(!userEmail || pathname === "/login");
  }, [pathname])

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setIsDarkMode(!isDarkMode)
  }

  if (displayNone) {
    return null;
  }

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <Button className="h-8 w-8 cursor-pointer" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">CinBora Postar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button
            className="h-8 w-8 cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}