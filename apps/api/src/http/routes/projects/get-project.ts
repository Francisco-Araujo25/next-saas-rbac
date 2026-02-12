import { auth } from "@/http/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { BadRequestError } from "../_errors/bad-request-error";

export async function getProject(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get('/organizations/:orgSlug/projects/:projectSlug', 
        {
        schema: {
            tags: ['projects'],
            summary: 'Get Project Details',
            security: [{ bearerAuth: [] }],
            params: z.object({
                orgSlug: z.string(),
                projectSlug: z.string().uuid(),
            }),
             response: {
            200: z.object({
                    project:z.object({
                        id: z.string(),
                        description: z.string().nullable(),
                        name: z.string(),
                        slug: z.string(),
                        avatarUrl: z.string().nullable(),
                        organizationId: z.string().uuid(),
                        ownerId: z.string().uuid(),
                        owner: z.object({
                            id: z.string().uuid(),
                            name:  z.string().nullable(),
                            avatarUrl:  z.string().nullable(),
    }),
                    }),
                }), 
            },
        },
    }, 
    async (request, reply) => {
        const { orgSlug, projectSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } = await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Project')) {
            throw new UnauthorizedError(
                `You're not allowed to se this project.`
            )
        }

        const project = await prisma.project.findUnique({
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                ownerId: true,
                avatarUrl: true,
                organizationId: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,

                    },
                },
            },
            where: {
                slug: projectSlug,
                organizationId: organization.id,
            },
        })

        if(!project){
            throw new BadRequestError('Project not found.')
        }
        return reply.send({ project })
    }, 
)
}