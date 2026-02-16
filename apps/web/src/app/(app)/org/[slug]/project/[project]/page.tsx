import { redirect } from "next/navigation"
import { Calendar, Settings, Trash2, Users } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { ability, getCurrentOrg } from "@/auth/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getProject } from "@/http/get-project"
import { Header } from "@/components/header"
import { Tabs } from "@/components/tabs"
import Link from "next/link"

dayjs.extend(relativeTime)

interface ProjectPageProps {
    params: Promise<{
        slug: string
        project: string
    }>
}

export default async function Project({ params }: ProjectPageProps) {
    const { slug, project: projectSlug } = await params
    const currentOrg = await getCurrentOrg()
    const permissions = await ability()

    if (!currentOrg) {
        redirect('/')
    }

    const { project } = await getProject(currentOrg, projectSlug)

    const canUpdateProject = permissions?.can('update', 'Project')
    const canDeleteProject = permissions?.can('delete', 'Project')

    return (
        <div className="py-4 space-y-4">
            <main className="mx-auto w-full max-w-[1200px] space-y-4">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <Avatar className="size-16">
                            {project.avatarUrl && (
                                <AvatarImage src={project.avatarUrl} alt={project.name} />
                            )}
                            <AvatarFallback className="text-lg">
                                {project.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                            <p className="text-muted-foreground mt-1">
                                {project.description || 'No description provided'}
                            </p>
                        </div>
                    </div>

                     {/*  <div className="flex gap-2">
                        {canUpdateProject && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/org/${params.slug}/project/${params.project}/settings`}>
                                    <Settings className="size-4 mr-2" />
                                    Settings
                                </Link>
                            </Button>
                        )}
                        {canDeleteProject && (
                            <Button variant="destructive" size="sm">
                                <Trash2 className="size-4 mr-2" />
                                Delete
                            </Button>
                        )}
                    </div> */}
                </div>

                <Separator />

                {/* Project Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Owner</CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Avatar className="size-8">
                                    {project.owner.avatarUrl && (
                                        <AvatarImage src={project.owner.avatarUrl} alt={project.owner.name || 'Owner'} />
                                    )}
                                    <AvatarFallback>
                                        {(project.owner.name || 'U').substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{project.owner.name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">Project owner</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Created</CardTitle>
                            <Calendar className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {dayjs(project.createdAt).fromNow()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {dayjs(project.createdAt).format('MMMM D, YYYY')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Active</div>
                            <p className="text-xs text-muted-foreground">
                                Project is running
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Project Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Detailed information about this project
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground">
                                {project.description || 'No description available for this project.'}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-2">Project Details</h3>
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="font-medium text-muted-foreground">Project ID</dt>
                                    <dd className="font-mono text-xs mt-1">{project.id}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-muted-foreground">Slug</dt>
                                    <dd className="font-mono text-xs mt-1">{project.slug}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-muted-foreground">Organization</dt>
                                    <dd className="mt-1">{currentOrg}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-muted-foreground">Created At</dt>
                                    <dd className="mt-1">{dayjs(project.createdAt).format('MMM D, YYYY HH:mm')}</dd>
                                </div>
                            </dl>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}