export default function PromoBanner() {
  return (
    <div className="mx-4 sm:mx-12 mb-20 bg-gradient-to-br from-[#8B7500] via-[#6B5A00] to-[#4A3E00]
      border border-[#FFD700]/30 p-6 sm:p-14 relative overflow-hidden flex
      flex-col md:flex-row justify-between items-center gap-6 md:gap-10 shadow-xl shadow-[#FFD700]/20">
      <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 
        font-['Bebas_Neue'] text-[120px] sm:text-[180px] text-[#FFD700]/10 leading-none pointer-events-none">
        SPEED
      </div>
      <div className="text-center md:text-left">
        <h3 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-white leading-none mb-2">
          FIRST ORDER? GET{' '}
          <span className="text-[#FFD700]">20% OFF</span>
        </h3>
        <p className="text-yellow-200 text-xs sm:text-sm">
          Valid on all single cars & track sets. No minimum order.
        </p>
      </div>
      <div className="bg-[#4A3E00] border border-dashed border-[#FFD700]/35 
        px-6 sm:px-10 py-4 sm:py-5 text-center flex-shrink-0 w-full md:w-auto">
        <span className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-[#FFD700] tracking-[5px] block">
          SPEED20
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[2px] uppercase text-gray-500">
          Use at checkout
        </span>
      </div>
    </div>
  )
}
