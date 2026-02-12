import { api } from "./api-client"

// Interface que define a estrutura da resposta da API de billing
// Renomeada de 'GetBilling' para 'GetBillingResponse' para corresponder ao uso em .json<GetBillingResponse>()
interface GetBillingResponse {
    billing: {
     seats: {
        amount: number
        unit: number
        price: number
    }
    projects: { 
        amount: number
        unit: number
        price: number
    }
    total: number
}
}


export async function getBilling(org:string) {
     // Correção: Arrumado o caminho da URL (tinha uma barra extra: ${org/}billing -> ${org}/billing)
     // Correção: Usar a interface 'GetBillingResponse' em vez de 'GetBillingResponse' indefinido
     const result = await api
    .get(`organizations/${org}/billing`)
    .json<GetBillingResponse>()

    return result
}
