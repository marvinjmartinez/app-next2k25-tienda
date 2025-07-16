// src/components/printable-cart.tsx
import type { CartItem } from '@/context/cart-context';
import { LogoTienda } from './logo-tienda';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
};
  
const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

interface PrintableCartProps {
    items: CartItem[];
    total: number;
}

export function PrintableCart({ items, total }: PrintableCartProps) {
  return (
    <div className="p-8 font-sans bg-white text-black">
      <header className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
        <div>
          <LogoTienda width={64} height={64} className="h-16 w-auto" />
          <h1 className="text-2xl font-bold mt-2">Distrimin SAS</h1>
          <p className="text-sm">Av. de los Constructores 123, Colonia Industrial</p>
          <p className="text-sm">Ciudad Ejemplo, México</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase text-gray-700">Resumen de Carrito</h2>
          <p>
            <span className="font-semibold">Fecha:</span> {formatDate(new Date())}
          </p>
        </div>
      </header>

      <section className="mt-6">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold">Producto</th>
              <th className="p-3 font-semibold text-right">Cantidad</th>
              <th className="p-3 font-semibold text-right">Precio Unit.</th>
              <th className="p-3 font-semibold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
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
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold">IVA (16%):</span>
            <span>{formatCurrency(total * 0.16)}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-gray-300">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg">{formatCurrency(total * 1.16)}</span>
          </div>
        </div>
      </section>

      <footer className="mt-12 pt-4 border-t-2 border-gray-200 text-center text-xs text-gray-500">
        <p>Este es un resumen de su carrito de compras. Los precios son válidos al momento de la impresión.</p>
        <p>Gracias por su preferencia.</p>
      </footer>
    </div>
  );
}
