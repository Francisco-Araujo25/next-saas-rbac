'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'

// SCHEMA
const organizationSchema = z
  .object({
    name: z.string().min(4, { message: 'Please include at least 4 characters.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/
            return domainRegex.test(value)
          }
          return true
        },
        {
          message: 'Please, enter a valid domain',
        }
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
    avatar: z
      .union([z.instanceof(File), z.null()]) // Aceita File ou Null
      .optional()
      .refine((file) => {
        // Se não tiver arquivo ou for nulo, passa
        if (!file) return true
        // Se tiver arquivo, valida o tamanho
        return file.size <= 2 * 1024 * 1024
      }, {
        message: 'Image must be less than 2MB',
      })
      .refine((file) => {
        // Se não tiver arquivo ou for nulo, passa
        if (!file) return true
        // Se tiver arquivo, valida o tipo
        return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      }, {
        message: 'Only JPEG, PNG and WebP are supported',
      }),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is required when auto-join is enabled.',
      path: ['domain'],
    }
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

// CREATE ACTION
export async function createOrganizationAction(data: FormData) {
  // Truque para limpar arquivo vazio (size 0) antes do Zod validar
  const avatarFile = data.get('avatar') as File | null
  if (avatarFile && avatarFile.size === 0) {
    data.delete('avatar')
  }

  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    let avatarUrl = null
    
    // Pegamos o arquivo original novamente para converter
    const fileToUpload = data.get('avatar') as File | null

    if (fileToUpload && fileToUpload.size > 0) {
      const buffer = Buffer.from(await fileToUpload.arrayBuffer())
      const base64Image = buffer.toString('base64')
      avatarUrl = `data:${fileToUpload.type};base64,${base64Image}`
    }

    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
      avatar: avatarUrl,
    })

    revalidateTag('organizations')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  return { success: true, message: 'Successfully saved the organization.', errors: null }
}

// UPDATE ACTION
export async function updateOrganizationAction(data: FormData) {
  const currentOrg = await getCurrentOrg()

  // Truque para limpar arquivo vazio na atualização também
  const avatarFile = data.get('avatar') as File | null
  if (avatarFile && avatarFile.size === 0) {
    data.delete('avatar')
  }

  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    // ⚠️ AQUI ESTAVA O ERRO: Faltava converter a imagem para Base64 no Update
    let avatarUrl = null
    const fileToUpload = data.get('avatar') as File | null

    if (fileToUpload && fileToUpload.size > 0) {
      const buffer = Buffer.from(await fileToUpload.arrayBuffer())
      const base64Image = buffer.toString('base64')
      avatarUrl = `data:${fileToUpload.type};base64,${base64Image}`
    }

    await updateOrganization({
      org: currentOrg!,
      name,
      domain,
      shouldAttachUsersByDomain,
      avatar: avatarUrl, // Agora enviamos a string Base64 correta
    })

    revalidateTag('organizations')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  return { success: true, message: 'Successfully saved the organization.', errors: null }
}