import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ArrowRight } from "lucide-react";

import { getCurrentOrg } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/http/get-projects";
import Link from 'next/link';


dayjs.extend(relativeTime)
export async function ProjectList() {
    const currentOrg = await getCurrentOrg()
    console.log('🔍 CurrentOrg:', currentOrg)  // ✅ Adiciona
    
    try {
        const { projects } = await getProjects(currentOrg!)
        console.log('✅ Projects loaded:', projects.length)  // ✅ Adiciona
        
        return (
            <div className="grid grid-cols-2 gap-4">
                {projects.map(project => {
                    return (
                 <Card key={project.id} className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-xl font-medium">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2 leading-relaxed">
                            {project.description}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center gap-1.5">
                        <Avatar className="size-4">
                            {project.owner.avatarUrl && (
                                <AvatarImage src={project.owner.avatarUrl} />
                            )}
                            <AvatarFallback />
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate">
                            <span className="font-medium text-foreground">{project.owner.name}</span> {dayjs(project.createdAt).fromNow()}
                            </span>
                            <Link href={`/org/${currentOrg}/project/${project.slug}`} className='ml-auto'>
                                 <Button size="xs" variant="outline" className="ml-auto">
                                    View <ArrowRight className="size-3 ml-2" />
                                 </Button>
                             </Link>
                    </CardFooter>
                </Card>
                    )
                })}
            </div>
        )
    } catch (error) {
        console.error('❌ Error loading projects:', error)  // ✅ Adiciona
        throw error
    }
}