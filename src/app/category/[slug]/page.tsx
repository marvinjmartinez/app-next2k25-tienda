// src/app/category/[slug]/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const router = useRouter();

    useEffect(() => {
        router.replace(`/products?category=${params.slug}`);
    }, [router, params.slug]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p>Redirigiendo a la categoría...</p>
        </div>
    );
}
