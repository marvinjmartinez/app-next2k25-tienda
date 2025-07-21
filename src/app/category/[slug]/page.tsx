// src/app/category/[slug]/page.tsx
import { redirect } from 'next/navigation';

export default function CategoryPage({ params }: { params: { slug: string } }) {
    // Redirect server-side to the filtered products page.
    // This is more performant than a client-side redirect with useEffect.
    redirect(`/products?category=${params.slug}`);

    // This part will not be rendered due to the redirect.
    // It's here as a fallback, just in case.
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Redirigiendo...</p>
        </div>
    );
}
