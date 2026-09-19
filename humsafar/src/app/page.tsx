import Link from 'next/link';
import { UserCircle, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-senior-blue gap-8 text-white">
      <h1 className="text-elder-3xl font-black text-senior-yellow mb-4 text-center">
        हमसफ़र (HUMSAFAR)
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <Link 
          href="/senior"
          className="flex-1 bg-senior-yellow text-senior-black p-12 rounded-3xl flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform border-8 border-transparent focus:border-white shadow-2xl"
        >
          <UserCircle size={96} />
          <h2 className="text-elder-3xl font-black text-center">SENIOR MODE<br/>(बुजुर्ग मोड)</h2>
        </Link>

        <Link 
          href="/guardian"
          className="flex-1 bg-white text-senior-blue p-12 rounded-3xl flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform border-8 border-transparent focus:border-senior-yellow shadow-2xl"
        >
          <Shield size={96} />
          <h2 className="text-elder-2xl font-black text-center">GUARDIAN PORTAL<br/>(संरक्षक)</h2>
        </Link>
      </div>
    </main>
  );
}
