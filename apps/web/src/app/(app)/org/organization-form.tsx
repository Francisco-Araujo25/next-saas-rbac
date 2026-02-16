'use client'

import { AlertTriangle, Loader2 } from "lucide-react"
import { useState, ChangeEvent } from 'react'  // ✅ Adiciona ChangeEvent
import Image from 'next/image'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hooks/use-form-state"

import { createOrganizationAction, OrganizationSchema, updateOrganizationAction } from "./actions"

interface OrganizationFormProps {
    isUpdating?: boolean
    initialData?: OrganizationSchema
}

export function OrganizationForm({
    isUpdating = false,
    initialData,
}: OrganizationFormProps) {
    // ✅ Move estado para dentro do componente
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initialData?.avatarUrl || null
    )

    // ✅ Move função para dentro do componente
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const formAction = isUpdating ? updateOrganizationAction : createOrganizationAction
    
    const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
        formAction,  // ✅ Usa formAction, não createOrganizationAction direto
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-4">  {/* ✅ onClick -> onSubmit */}
            {success === false && message && (
                <Alert variant="destructive">
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Save organization failed!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            {success === true && message && (
                <Alert variant="success">
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-1">
                <Label htmlFor="name">Organization name</Label>
                <Input name="name" id="name" defaultValue={initialData?.name} />

                {errors?.name && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {errors.name[0]}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="domain">E-mail domain</Label>
                <Input 
                    name="domain" 
                    type="text" 
                    id="domain" 
                    inputMode="url" 
                    placeholder="example.com" 
                    defaultValue={initialData?.domain ?? undefined} 
                />

                {errors?.domain && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {errors.domain[0]}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4 py-4">
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/20 bg-muted overflow-hidden">
                    {previewUrl ? (
                        <Image 
                            src={previewUrl} 
                            width={64}
                            height={64}
                            className="size-full rounded-full object-cover" 
                            alt="Preview" 
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-xs text-white">
                            No Logo
                        </div>
                    )}
                </div>
                
                <div className="flex-1 space-y-1">
                    <Label htmlFor="avatar">Organization Logo</Label>
                    <Input 
                        name="avatar" 
                        id="avatar" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                    />
                    <p className="text-[10px] text-muted-foreground">
                        Optional: A decorative gradient will be used if empty.
                    </p>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                    <div className="translate-y-0.5">
                        <Checkbox 
                            name="shouldAttachUsersByDomain" 
                            id="shouldAttachUsersByDomain" 
                            defaultChecked={initialData?.shouldAttachUsersByDomain} 
                        />
                    </div>
                    <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
                        <span className="text-sm font-medium leading-none">
                            Auto-join new members
                        </span>
                        <p className="text-sm text-muted-foreground">
                            This will automatically invite all members with same e-mail domain to this organization.
                        </p>
                    </label>
                </div>
                
                {errors?.shouldAttachUsersByDomain && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {errors.shouldAttachUsersByDomain[0]}
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    isUpdating ? 'Update organization' : 'Save organization'
                )}
            </Button>
        </form>
    )
}