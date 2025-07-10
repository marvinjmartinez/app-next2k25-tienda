"use server";

import { suggestProductsForQuote as suggestProductsForQuoteFlow, SuggestProductsForQuoteInput } from "@/ai/flows/suggest-products-for-quote";
import { z } from "zod";

const formSchema = z.object({
    customerPreferences: z.string().min(10, "Por favor, describe las preferencias del cliente en al menos 10 caracteres."),
    pastInteractions: z.string().optional(),
});

export async function suggestProductsForQuoteAction(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = formSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors.customerPreferences?.[0] || "Entrada inválida."
        };
    }
    
    try {
        const aiInput: SuggestProductsForQuoteInput = {
            customerPreferences: validation.data.customerPreferences,
            pastInteractions: validation.data.pastInteractions,
        };

        const result = await suggestProductsForQuoteFlow(aiInput);

        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." };
    }
}
