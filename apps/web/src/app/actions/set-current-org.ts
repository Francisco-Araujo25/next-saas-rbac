// app/actions/set-current-org.ts
'use server'

import { cookies } from 'next/headers'

export async function setCurrentOrg(slug: string) {
  const cookieStore = await cookies()

  cookieStore.set('org', slug, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  })
}
