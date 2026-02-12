import { OrganizationForm } from "@/app/(app)/org/organization-form"
import { ability, getCurrentOrg } from "@/auth/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrganization } from "@/http/get-organization"
import { getOrganizations } from "@/http/get-organizations"

import { Billing } from "./billing"
import { ShutdownOrganizationButton } from "./shutdown-organization-button"

export default async function Settings() {

    const currentOrg = await getCurrentOrg()

    const permissions = await ability()
    
        const canUpdateOrganization = permissions?.can('update', 'Organization')
        const canGetBilling = permissions?.can('get', 'Billing')
    
        const canGetMembers = permissions?.can('get', 'User')
        const canGetProjects = permissions?.can('get', 'Project')

        const canShutdownOrganization = permissions?.can('delete', 'Organization')

        const { organization } = await getOrganization(currentOrg!)

   return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
            {canUpdateOrganization && (
                <Card>
                    <CardHeader>
                        <CardTitle>Organization settings</CardTitle>
                        <CardDescription>Update your organization details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrganizationForm  isUpdating initialData={{
                            name: organization.name,
                            domain: organization.domain,
                            shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain,
                        }} />
                    </CardContent>
                </Card>
            )}


      {canGetBilling && <Billing />}

                 {canShutdownOrganization && (
                <Card>
                    <CardHeader>
                        <CardTitle>Shutdown Organization</CardTitle>
                        <CardDescription>This will delete all organization data including  all projects. You cannot undo this action.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrganizationForm />
                    </CardContent>
                    <ShutdownOrganizationButton />
                </Card>
            )}
      </div>
    </div>
   )
  
}
