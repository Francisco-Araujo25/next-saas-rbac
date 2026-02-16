import { auth } from "@/http/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "@/lib/prisma";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";

export async function getInvites(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/organizations/:slug/invites', {
        schema: {
            tags: ['invites'],
            summary: 'Get all organization invites',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
                200: z.object({
                    invites: z.array(z.object({  // ✅ Remove o "invite:" wrapper
                        id: z.string().uuid(),
                        role: roleSchema,
                        email: z.string().email(),
                        createdAt: z.date(),
                        author: z.object({
                            id: z.string().uuid(),
                            name: z.string().nullable(),
                        }).nullable(),
                    })),
                })
            },
        },
    },
    async (request) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Invite')) {
            throw new UnauthorizedError(
                `You're not allowed to get organization invites.`
            )
        }

        const invites = await prisma.invite.findMany({
            where: {
                organizationId: organization.id,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return {
            invites: invites.map(invite => ({  // ✅ Remove o "invite:" wrapper
                id: invite.id,
                email: invite.email,
                role: invite.role,
                createdAt: invite.createdAt,
                author: invite.author
                    ? {
                        id: invite.author.id,
                        name: invite.author.name,
                    }
                    : null,
            })),
        }
    })
}