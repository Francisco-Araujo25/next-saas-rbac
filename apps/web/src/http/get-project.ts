import { api } from "./api-client"

interface GetProjectResponse {
    project: {
        id: string
        name: string
        description: string | null
        slug: string
        avatarUrl: string | null
        organizationId: string
        ownerId: string
        createdAt: string
        owner: {
            id: string
            name: string | null
            avatarUrl: string | null
        }
    }
}

export async function getProject(org: string, projectSlug: string) {
    const result = await api
        .get(`organizations/${org}/projects/${projectSlug}`)
        .json<GetProjectResponse>()

    return result
}