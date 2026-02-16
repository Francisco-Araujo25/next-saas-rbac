import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(slug: string): Promise<{
      organization: {
        id: string
        name: string
        slug: string
        domain: string | null
        shouldAttachUsersByDomain: boolean
        avatarUrl: string | null
        createdAt: Date
        updatedAt: Date
        ownerId: string
      }
      membership: {
        id: string
        role: 'ADMIN' | 'MEMBER' | 'BILLING'
        organizationId: string
        userId: string
      }
    }>
  }
}
