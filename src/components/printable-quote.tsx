// src/components/printable-quote.tsx
import type { Quote } from '@/app/sales/create-quote/page';
import { LogoTienda } from './logo-tienda';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
};
  
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

interface PrintableQuoteProps {
    quote: Quote;
}

export function PrintableQuote({ quote }: PrintableQuoteProps) {
  return (
    <div className="p-8 font-sans bg-white text-black">
      <header className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
        <div>
          <LogoTienda className="h-16 w-auto" />
          <h1 className="text-2xl font-bold mt-2">Distrimin SAS</h1>
          <p className="text-sm">Av. de los Constructores 123, Colonia Industrial</p>
          <p className="text-sm">Ciudad Ejemplo, México</p>
          <p className="text-sm">contacto@distriminsas.com | +52 (55) 1234 5678</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase text-gray-700">Cotización</h2>
          <p className="mt-1">
            <span className="font-semibold">#</span> {quote.id}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span> {formatDate(quote.date)}
          </p>
        </div>
      </header>

      <section className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700">Cliente:</h3>
        <p className="font-bold text-lg">{quote.customerName}</p>
      </section>

      <section className="mt-6">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold">#</th>
              <th className="p-3 font-semibold">Producto</th>
              <th className="p-3 font-semibold text-right">Cantidad</th>
              <th className="p-3 font-semibold text-right">Precio Unit.</th>
              <th className="p-3 font-semibold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                <td className="p-3 text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex justify-end mt-6">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2">
            <span className="font-semibold">Subtotal:</span>
            <span>{formatCurrency(quote.total)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold">IVA (16%):</span>
            <span>{formatCurrency(quote.total * 0.16)}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-gray-300">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg">{formatCurrency(quote.total * 1.16)}</span>
          </div>
        </div>
      </section>

      <footer className="mt-12 pt-4 border-t-2 border-gray-200 text-center text-xs text-gray-500">
        <p>Precios sujetos a cambio sin previo aviso. Esta cotización tiene una validez de 15 días.</p>
        <p>Gracias por su preferencia.</p>
      </footer>
    </div>
  );
}
