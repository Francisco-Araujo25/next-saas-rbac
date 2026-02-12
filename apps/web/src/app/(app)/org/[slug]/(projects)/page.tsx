import { ability, getCurrentOrg } from "@/auth/auth"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProjectList } from "./project-list"

export default async function Projects() {
   // Correção: getCurrentOrg() é async, precisa de await
   const currentOrg = await getCurrentOrg()
   const permissions = await ability()
   return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         {/* Correção: text2xl -> text-2xl (Tailwind class) */}
         <h1 className="text-2xl font-bold">Projects</h1>

         {/* Correção: currentOrg! após await */}
         {permissions?.can('create', 'Project') && currentOrg && (
            <Button size="sm" asChild>
               <Link href={`/org/${currentOrg}/create-project`}>
                    <Plus className="size-4 mr-2" />
                  Create project
               </Link>
            </Button>
         )}
      </div>

      {permissions?.can('get', 'Project') ? (
         <ProjectList />
      ) : (
         <p className="text-sm text-muted-foreground">
            {/* Correção gramatical: "You are now allowed to see" -> "You are not allowed to see" */}
            You are not allowed to see projects
         </p>
      )}
    </div>
   )
}

