import { ChevronDown, LogOut } from "lucide-react";

import { auth } from "@/auth/auth";
import { signOutAction } from "@/app/auth/actions"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

function getInitials(name: string): string {
  if (!name) return "??"
  
  const words = name.trim().split(" ")
  
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  
  return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join("")
}

export async function ProfileButton() {
    let user
    
    try {
        const result = await auth()
        user = result.user
    } catch (error) {
        console.error('ProfileButton: Failed to get user', error)
        // Se falhar, não renderiza nada
        return null
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <Avatar className="size-8">
                    {typeof user.avatarUrl === "string" && <AvatarImage src={user.avatarUrl} />}
                    <AvatarFallback>{getInitials(user.name ?? "")}</AvatarFallback>
                </Avatar>
                <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <form action={signOutAction} className="w-full">
                        <button type="submit" className="flex w-full items-center text-sm outline-none">
                            <LogOut className="mr-2 size-4" />
                            Sign Out
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}