'use client'
const CATEGORIES = [
  { img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop&auto=format', name: 'Sports Cars', count: '120 models' },
  { img: 'https://images.unsplash.com/photo-XCb0_seKL-U?w=300&h=300&fit=crop&auto=format', name: 'Muscle Cars', count: '88 models' },
  { img: 'https://images.unsplash.com/photo-pJIejGMCMmE?w=300&h=300&fit=crop&auto=format', name: 'Track Sets', count: '34 sets' },
  { img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=300&fit=crop&auto=format', name: 'Treasure Hunt', count: 'Limited' },
  { img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=300&fit=crop&auto=format', name: 'Vintage', count: '200+ models' },
]

export default function CategoryStrip() {
  return (
    <div className="bg-gradient-to-r from-[#FF3D00]/5 via-[#FFD700]/5 to-[#FF3D00]/5 px-4 sm:px-12 py-8 sm:py-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-[#FF3D00]/8 rounded-full blur-[100px]" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 relative z-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            className="aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300
              group relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#FF3D00]/20
              border border-white/20"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF3D00] 
              scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="font-['Barlow_Condensed'] text-[10px] sm:text-xs font-bold tracking-[2px] 
                uppercase text-white drop-shadow-lg">{cat.name}</span>
              <span className="text-[9px] sm:text-[10px] text-white/80 drop-shadow">{cat.count}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
