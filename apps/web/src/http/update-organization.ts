import { api } from "./api-client"

interface UpdateOrganizationRequest {
    org: string
    name: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatar?: File  // ✅ Adiciona
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
    org,
    name,
    domain,
    shouldAttachUsersByDomain,
    avatar,  // ✅ Adiciona
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
    await api.put(`organizations/${org}`, {
        json: {
            name,
            domain,
            shouldAttachUsersByDomain,
            avatar,  // ✅ Adiciona
        },
    })
}