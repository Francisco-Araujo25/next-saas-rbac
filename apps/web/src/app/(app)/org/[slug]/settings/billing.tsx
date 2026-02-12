import { getCurrentOrg } from "@/auth/auth"
import { Card, CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBilling } from "@/http/get-billing"

export async function Billing() {
    // Correção: getCurrentOrg() é uma função async que retorna Promise<string | null>
    // Era necessário usar 'await' para aguardar a resolução da Promise antes de passar para getBilling()
    const currentOrg = await getCurrentOrg()
    const { billing } = await getBilling(currentOrg!)

    // Função helper para formatar valores monetários
    const formatCurrency = (value: number) => 
        value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    return (
        <>
        <Separator />

        <Card>
            <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Information about your organization costs</CardDescription>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Cost type</TableHead>
                        {/* Correção: style é uma propriedade separada, não faz parte de className */}
                        <TableHead className="text-right" style={{ width: 120 }}>Quantity</TableHead>
                        <TableHead className="text-right" style={{ width: 200 }}>Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Amount of projects</TableCell>
                            <TableCell className="text-right">{billing.projects.amount}</TableCell>
                            <TableCell className="text-right">
                                {/* Correção: billing.projects.price é number */}
                                {formatCurrency(billing.projects.price)} 
                                ({formatCurrency(billing.projects.unit)} each)
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Amount of seats</TableCell>
                            <TableCell className="text-right">{billing.seats.amount}</TableCell>
                           <TableCell className="text-right">
                                {formatCurrency(billing.seats.price)} ({formatCurrency(billing.seats.unit)} each)
                            </TableCell>
                        </TableRow>
                        <TableFooter>
                        <TableRow>
                            <TableCell />
                            <TableCell className="text-right">Total</TableCell>
                             {/* Correção: billing.total é number, usar toLocaleString() no total */}
                             <TableCell className="text-right">{formatCurrency(billing.total)}</TableCell>
                        </TableRow>
                        </TableFooter>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </>
    )
}

