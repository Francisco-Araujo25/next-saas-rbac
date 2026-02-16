import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { auth } from "@/auth/auth"
import { getOrganizations } from "@/http/get-organizations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import Link from "next/link"
import { LiveClock } from "@/components/live-clock"

export default async function Home() {
    const currentUser = await auth()  // ✅ Renomeia para evitar conflito
    
    if (!currentUser) {
        redirect('/auth/sign-in')
    }

    const { organizations } = await getOrganizations()

    // Se tiver apenas 1 organização, redireciona direto
  /*   if (organizations.length === 1) {
        redirect(`/org/${organizations[0].slug}`)
    } */

    return (
        <div className="py-4 space-y-4">
            <Header />
            <main className="mx-auto w-full max-w-[1200px] space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back, {currentUser.user.name?.split(' ')[0] || 'there'} 
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Select an organization to get started
                        </p>
                    </div>
                      <LiveClock /> 
                    <Button asChild>
                        <Link href="/create-organization">
                            <Plus className="size-4 mr-2" />
                            Create organization
                        </Link>
                    </Button>
                </div>

                {organizations.length === 0 ? (
                    <Card className="border-dashed">
                        <CardHeader className="text-center pb-10 pt-16">
                            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-muted">
                                <Building2 className="size-10 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-2xl">No organizations yet</CardTitle>
                            <CardDescription className="text-base max-w-sm mx-auto">
                                Create your first organization to start managing projects and collaborating with your team
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center pb-16">
                            <Button size="lg" asChild>
                                <Link href="/create-organization">
                                    <Plus className="size-4 mr-2" />
                                    Create your first organization
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {organizations.map((org) => (
                            <Link key={org.id} href={`/org/${org.slug}`}>
                                <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-start gap-4">
                                            <Avatar className="size-12">
                                                {typeof org.avatarUrl === 'string' && org.avatarUrl && ( 
                                                    <AvatarImage src={org.avatarUrl} alt={org.name || 'Organization'} />
                                                )}
                                                <AvatarFallback className="text-lg">
                                                    {(org.name || 'OR').substring(0, 2).toUpperCase()} 
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1">
                                                <CardTitle className="text-xl">{org.name || 'Unnamed Organization'}</CardTitle> 
                                                <CardDescription className="text-xs">
                                                    {org.role}  
                                                </CardDescription>
                                            </div>
                                        </div>
                                 </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}