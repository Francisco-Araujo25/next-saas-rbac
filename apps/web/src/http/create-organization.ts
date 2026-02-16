import { api } from "./api-client"

interface CreateOrganizationRequest {
    name: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatar?: File | null
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
            avatar,
        },
    })
}