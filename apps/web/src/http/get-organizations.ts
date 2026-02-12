import { api } from "./api-client"

interface GetOrganizationsResponse {
    organizations: {
    slug: any;
    id: string;
    name: string | null;
    email: string;
    avatarUrl: unknown;
}[]
}

export async function getOrganizations() {
     const result = await api
    .get('organizations', {
        next: {
            tags:  ['organizations'],
        }
    })
    .json<GetOrganizationsResponse>()

    return result
}