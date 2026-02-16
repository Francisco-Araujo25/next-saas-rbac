import { Slash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import brickbybrickIcon from '@/assets/brickbybrick-icon.png'
import { ability, getCurrentOrg } from '@/auth/auth'

import { OrganizationSwitcher } from './organization-switcher'
import { PendingInvites } from './pending-invites'
import { ProfileButton } from './profile-button'
import { ProjectSwitcher } from './project-switcher'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'

export async function Header() {
    const permissions = await ability()
    const currentOrg = await getCurrentOrg() // Pegamos o slug da org atual

    // Se houver uma org, o link vai para o dashboard dela. Se não, vai para a raiz.
    const logoHref = currentOrg ? `/org/${currentOrg}` : '/'
    
    return (
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <div className="flex items-center gap-3">
            <Link href="/" prefetch={false} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary border border-foreground flex items-center justify-center transition-all duration-200 group-hover:shadow-[var(--shadow-brutal-sm)]">
            <Image src={brickbybrickIcon} alt="Brick by Brick Logo" className="w-6 h-6" />
          </div>
          <span className="font-display font-semibold text-foreground text-lg hidden sm:block">
            Brick Labs
          </span>
        </Link>

            <Slash className='size-3 -rotate-[24deg] text-border' />

            <OrganizationSwitcher />

            {permissions?.can('get', 'Project') && (
                <>
                <Slash className='size-3 -rotate-[24deg] text-border' />
                <ProjectSwitcher />
                </>
            )}

        </div>

            <div className="flex items-center gap-4">
                <PendingInvites />
                <Separator orientation='vertical' className='h-5' />
                <ThemeSwitcher />
                <ProfileButton />
            </div>
        </div>
    )
}