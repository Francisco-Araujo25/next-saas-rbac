'use server'

import { redirect } from "next/navigation"
import { env } from "process"

export async function signInWithGithub() {
    const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

    const clientId = env.GITHUB_OAUTH_CLIENT_ID
    if (!clientId) {
        throw new Error('Missing GITHUB_OAUTH_CLIENT_ID environment variable')
    }
    githubSignInURL.searchParams.set('client_id', clientId)

    const redirectUri = env.GITHUB_OAUTH_CLIENT_REDIRECT_URI
    if (!redirectUri) {
        throw new Error('Missing GITHUB_OAUTH_CLIENT_REDIRECT_URI environment variable')
    }
    githubSignInURL.searchParams.set('redirect_uri', redirectUri)

    githubSignInURL.searchParams.set('scope', 'user')

    redirect(githubSignInURL.toString())
}
