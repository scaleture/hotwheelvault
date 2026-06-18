export default function MarqueeTicker() {
  const items = [
    'FREE SHIPPING OVER ₹999',
    'NEW TREASURE HUNT SERIES 2024',
    'SUPER TREASURE HUNT IN STOCK',
    'AUTHENTIC MATTEL LICENSED',
    'FAST 2-DAY PAN-INDIA DELIVERY',
  ]
  const doubled = [...items, ...items]

  return (
    <div className="bg-gradient-to-r from-[#FF3D00] via-[#FF5500] to-[#FFD700] py-3 overflow-hidden relative">
      <div className="absolute inset-0 bg-[length:40px_40px] opacity-10" style={{backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 50%, white 50%, white 75%, transparent 75%)'}} />
      <div className="flex whitespace-nowrap marquee-track relative z-10">
        {doubled.map((item, i) => (
          <span key={i} className="font-['Bebas_Neue'] text-sm tracking-[4px] 
            text-white px-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            {item}
            <span className="ml-8 text-[#FFD700] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">★</span>
          </span>
        ))}
      </div>
    </div>
  )
}
