import { api } from "./api-client"

interface CreateOrganizationRequest {
    name: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatar?: string | null
}

type CreateOrganizationResponse = void

export async function createOrganization({
    name,
    domain,
    shouldAttachUsersByDomain,
    avatar,
}:   CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
     await api
    .post('organizations', {
        json: {
            name,
            domain,
            shouldAttachUsersByDomain,
            avatarUrl: avatar, // Enviamos a string Base64 para o backend
        },
    })
}