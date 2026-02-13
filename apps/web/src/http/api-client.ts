import type { CookiesFn } from 'cookies-next'
import { getCookie } from 'cookies-next'   //mudar para { getCookie }
import ky from 'ky'

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL!,
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined


        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')
         cookieStore = serverCookies
        } 
                        //retirar cookiesNext se não funcionar
          const token = getCookie('token', { cookies: cookieStore })

            if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
      },
    ],
  },
})