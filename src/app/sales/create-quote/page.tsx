import { PageHeader } from '@/components/page-header';
import { AiProductSuggester } from '@/components/ai-product-suggester';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CreateQuotePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Quote"
        description="Use the AI assistant to get product suggestions based on your customer's needs."
      />
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Quote Details</CardTitle>
                    <CardDescription>Enter customer information and add products to the quote.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Quote form elements will be here...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <AiProductSuggester />
        </div>
      </div>
    </div>
  );
}
