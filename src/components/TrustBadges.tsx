const BADGES = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: '✅', title: '100% Authentic', desc: 'Official Mattel licensed' },
  { icon: '🔄', title: 'Easy Returns', desc: '15-day hassle-free returns' },
  { icon: '🔒', title: 'Secure Payments', desc: 'UPI · Cards available' },
]

export default function TrustBadges() {
  return (
    <div className="mx-4 sm:mx-12 mb-16 sm:mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
      border border-[#FF3D00]/20 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-[#FF3D00]/10
      bg-gradient-to-br from-[#FFF8F5] to-[#FFFFF5]">
      {BADGES.map((b, i) => (
        <div key={b.title} className="p-5 sm:p-7 text-center relative group hover:bg-[#FF3D00]/5 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF3D00] to-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{b.icon}</div>
          <div className="font-['Barlow_Condensed'] text-sm font-bold text-[#1A1A1A] mb-1">
            {b.title}
          </div>
          <div className="text-[11px] sm:text-xs text-gray-500">{b.desc}</div>
        </div>
      ))}
    </div>
  )
}
