import { ability, getCurrentOrg } from "@/auth/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getMembers } from "@/http/get-members"
import { getMembership } from "@/http/get-membership"
import { getOrganization } from "@/http/get-organization"
import { organizationSchema } from "@saas/auth"
import { ArrowLeftRight, Crown, UserMinus } from "lucide-react"
import { removeMemberAction } from "./actions"
import { UpdateMemberRoleSelect } from "./update-member-role-select"

export  async function MemberList() {
    // Correção: getCurrentOrg() é uma função async que retorna Promise<string | null>
    // Adicionado 'await' para aguardar a resolução da Promise
    const currentOrg = await getCurrentOrg() 
    const permissions = await ability()

    // Correção: Promise.all retorna um array, então a desestruturação deve ser [{ membership }, { members }, { organization }]
    // O código original tinha colchetes extras: [{ { membership }... }] que causava erro de sintaxe
    const [{ membership }, { members }, { organization }] = await Promise.all([
        getMembership(currentOrg!),
        getMembers(currentOrg!),
        getOrganization(currentOrg!),
    ])

    const authOrganization = organizationSchema.parse(organization)

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">Members</h2>

            <div className="rounded border">
                <Table>
                    <TableBody>
                        {members.map(member => {
                            return (
                                <TableRow key={member.id}>
                                    <TableCell className="py-2.5" style={{width: 48}}>
                                        <Avatar>
                                            {/* Correção: Usar AvatarImage em vez de Image diretamente */}
                                            {/* AvatarImage é o componente correto do shadcn/ui para imagens */}
                                            {member.avatarUrl && (
                                                <AvatarImage src={member.avatarUrl} alt="" />
                                            )}
                                            <AvatarFallback>
                                                {/* Fallback mostra as iniciais do usuário */}
                                                {member.name?.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            {/* Correção: organizationSchema.ownerId não existe, usar organization.ownerId */}
                                            {/* O schema era importado incorretamente, usamos diretamente o objeto 'organization' */}
                                            <span className="font-medium inline-flex items-center gap-2">
                                                {member.name} 
                                                {/* Correção: 'me' deve ser um elemento React, não apenas uma string */}
                                                {member.userId === membership.userId && <span>me</span>}
                                                {organization.ownerId === member.userId && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Crown className="size-3" />
                                                        Owner
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 5">
                                        <div className="flex items-center justify-end gap-2">
                                            {permissions?.can('transfer_ownership', authOrganization) && (
                                                <Button size="sm" variant="ghost">
                                                    <ArrowLeftRight className="size-4 mr-2" />
                                                    Transfer ownership
                                                    </Button>
                                            )}

                                            <UpdateMemberRoleSelect 
                                            memberId={member.id}
                                            value={member.role}
                                            disabled={
                                                member.userId === membership.userId ||
                                                member.userId === membership.ownerId ||
                                                permissions?.cannot('update', 'User')
                                            }
                                            />
                                            {permissions?.can('delete', 'User') && (
                                            <form action={removeMemberAction.bind(null, member.id)}>
                                            
                                                <Button disabled={member.userId === membership.userId || member.userId === organization.ownerId} type="submit" size="sm" variant="destructive">
                                                    <UserMinus className="mr-2 size-4" />
                                                        Remove
                                                </Button>
                                            </form>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

