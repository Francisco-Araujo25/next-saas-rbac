import brickbybrickIcon from '@/assets/brickbybrick-icon.png'
import Image from 'next/image'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organization-switcher'
import { ability } from '@/auth/auth'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme/theme-switcher'
import { ProjectSwitcher } from './project-switcher'
import { PendingInvites } from './pending-invites'

export async function Header() {
    const permissions = await ability()

    return (
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary border border-foreground flex items-center justify-center transition-all duration-200 group-hover:shadow-[var(--shadow-brutal-sm)]">
            <Image src={brickbybrickIcon} alt="Brick by Brick Logo" className="w-6 h-6" />
          </div>
          <span className="font-display font-semibold text-foreground text-lg hidden sm:block">
            Brick by Brick
          </span>
        </a>

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