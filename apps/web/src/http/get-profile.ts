import { api } from "./api-client"

interface GetProfileResponse {
    user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: unknown;
}
}

export async function getProfile() {
     const result = await api
    .get('profile')
    .json<GetProfileResponse>()

    return result
}