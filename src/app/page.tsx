import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/sales/create-quote');
  return null;
}
