import { XOctagon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { revokeInviteAction } from "./actions"

interface RevokeInviteButtonProps {
    inviteId: string
}

export function  RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
    console.log('🎯 InviteId no botão:', inviteId)  // ✅ Adiciona
    return (
        <form action={revokeInviteAction}>
            <input type="hidden" name="inviteId" value={inviteId} />
         <Button size="sm" variant="destructive">
            <XOctagon className="size-4 mr-2" />
                 Revoke invite
           </Button>
        </form>
    )
}