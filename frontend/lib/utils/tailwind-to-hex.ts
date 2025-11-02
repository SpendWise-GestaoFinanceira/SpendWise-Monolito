// Converte classes Tailwind bg-{color}-{shade} para hex
export function tailwindToHex(tailwindClass: string): string {
  const colorMap: Record<string, string> = {
    // Reds
    'bg-red-500': '#ef4444',
    'bg-red-600': '#dc2626',

    // Oranges
    'bg-orange-500': '#f97316',
    'bg-orange-600': '#ea580c',

    // Yellows
    'bg-yellow-500': '#eab308',
    'bg-yellow-600': '#ca8a04',

    // Greens
    'bg-green-500': '#22c55e',
    'bg-green-600': '#16a34a',
    'bg-emerald-500': '#10b981',

    // Blues
    'bg-blue-500': '#3b82f6',
    'bg-blue-600': '#2563eb',
    'bg-sky-500': '#0ea5e9',

    // Purples
    'bg-purple-500': '#a855f7',
    'bg-purple-600': '#9333ea',
    'bg-violet-500': '#8b5cf6',

    // Pinks
    'bg-pink-500': '#ec4899',
    'bg-pink-600': '#db2777',

    // Teals
    'bg-teal-500': '#14b8a6',
    'bg-cyan-500': '#06b6d4',

    // Grays (fallback)
    'bg-gray-500': '#6b7280',
    'bg-slate-500': '#64748b',
  };

  return colorMap[tailwindClass] || '#6b7280';
}
