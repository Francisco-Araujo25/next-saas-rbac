
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { z } from 'zod'
import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/bad-request-error";

export async function getInvite(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/invites/:inviteId', 
        {
        schema: {
            tags: ['invites'],
            summary: 'Get an invite',
           
            params: z.object({
                inviteId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    invite: z.object({
                            id: z.string().uuid(),
                            role: roleSchema,
                            email: z.string().email(),
                            createdAt: z.date(),
                            organization: z.object ({
                            name: z.string(),
                         }),
                         
                          author: z.object ({
                                id: z.string().uuid(),
                                name: z.string().nullable(),
                                avatarUrl: z.string().url().nullable(),
                            }).nullable(),
                        }),
                    }),
            },
        },
    }, 
    async (request) => {
         const { inviteId } = request.params

         const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId,
            },
            select: {
                id: true,
                email: true,
                role: true,
                CreatedAt: true,
                        organization: {   // <-- adicionado
                        select: { name: true },
                        },

                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            }
         })

      if (!invite) {
        throw new BadRequestError('Invite not found')
      }

      return { 
         invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        createdAt: invite.CreatedAt, 

        organization: invite.organization,
        author: invite.author,
  },
       }
    }, 
)
}