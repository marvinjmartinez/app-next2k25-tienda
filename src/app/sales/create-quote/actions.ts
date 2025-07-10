"use server";

import { suggestProductsForQuote as suggestProductsForQuoteFlow, SuggestProductsForQuoteInput } from "@/ai/flows/suggest-products-for-quote";
import { z } from "zod";

const formSchema = z.object({
    customerPreferences: z.string().min(10, "Please describe customer preferences in at least 10 characters."),
    pastInteractions: z.string().optional(),
});

export async function suggestProductsForQuoteAction(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = formSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors.customerPreferences?.[0] || "Invalid input."
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
        return { success: false, error: "An unexpected error occurred. Please try again." };
    }
}
