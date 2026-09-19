"use client";

import { FamilyMember } from '@/types';
import { PhoneCall, Video } from 'lucide-react';
import Image from 'next/image';

interface FamilyDialerGridProps {
  members: FamilyMember[];
}

export default function FamilyDialerGrid({ members }: FamilyDialerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      {members.map(member => (
        <div key={member.id} className="bg-white rounded-3xl border-8 border-senior-blue p-6 shadow-2xl flex flex-col gap-6 items-center text-center relative">
          
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-8 border-senior-yellow">
            <Image 
              src={member.photoUrl} 
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className={`absolute top-6 right-6 px-4 py-2 rounded-full font-black text-elder-lg border-4 ${
            member.status === 'Available' 
              ? 'bg-senior-green text-white border-green-900' 
              : 'bg-senior-red text-white border-red-900'
          }`}>
            {member.status.toUpperCase()}
          </div>

          <div className="flex flex-col">
            <h2 className="text-elder-3xl font-black">{member.name}</h2>
            <p className="text-elder-xl font-bold text-gray-600 uppercase">{member.relation}</p>
          </div>

          <div className="flex w-full gap-4 mt-4">
            <button 
              className="flex-1 bg-senior-blue text-white py-6 rounded-2xl flex items-center justify-center gap-4 min-h-[100px] border-4 border-transparent hover:bg-blue-900 focus:border-senior-yellow active:bg-blue-950"
              aria-label={`Voice call ${member.name}`}
            >
              <PhoneCall size={48} />
            </button>
            <button 
              className="flex-1 bg-senior-green text-white py-6 rounded-2xl flex items-center justify-center gap-4 min-h-[100px] border-4 border-transparent hover:bg-green-700 focus:border-senior-yellow active:bg-green-800"
              aria-label={`Video call ${member.name}`}
            >
              <Video size={48} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
