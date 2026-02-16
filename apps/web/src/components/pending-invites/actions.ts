'use server'

import { revalidateTag } from "next/cache";

import { acceptInvite } from "@/http/accept-invite";
import { rejectInvite } from '@/http/reject-invite'

export async function acceptInviteAction(inviteId: string) {
    await acceptInvite(inviteId)

    revalidateTag('organizations')
}

/* export async function rejectInviteAction(inviteId: string) {
    await acceptInvite(inviteId)

    revalidateTag('organizations')
} */

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
  
  // Força o Next.js a buscar os convites novamente para limpar o card da tela
  revalidateTag('invites') // ou o nome da tag que você usou no 'get-invites'
}