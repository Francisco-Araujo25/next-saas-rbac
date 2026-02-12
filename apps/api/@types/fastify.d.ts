import 'fastify'

import { Organization, Member } from '@prisma/client'

declare module 'fastify' {
    export interface FastifyRequest {
        getCurrentUserId(): Promisse<string>
        getUserMembership(slug: string): Promisse<{ organization: Organization, membership: Member }>
    }
}