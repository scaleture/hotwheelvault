export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] px-4 sm:px-12 pt-12 sm:pt-14 pb-7 border-t border-[#FF3D00]/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3D00]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-14 mb-10 sm:mb-12">
        <div>
          <div className="font-['Bebas_Neue'] text-lg sm:text-xl tracking-[3px] bg-gradient-to-r 
            from-[#FF3D00] to-[#FFD700] bg-clip-text text-transparent mb-4">
            🔥 HOTWHEEL VAULT
          </div>
          <p className="text-xs text-white/40 leading-[1.9]">
            India's premier destination for Hot Wheels collectors. 
            Authentic. Fast. Affordable. Est. 2024.
          </p>
        </div>
        {[
          { title: 'Shop', links: ['New Arrivals', 'Treasure Hunt', 'Track Sets', 'Vintage', 'Gift Cards'] },
          { title: 'Support', links: ['Track Your Order', 'Returns & Refunds', 'FAQ', 'Contact Us'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-['Barlow_Condensed'] text-[11px] font-bold tracking-[3px] 
              uppercase text-[#FFD700] mb-5">{col.title}</h4>
            <ul className="space-y-[10px] list-none p-0">
              {col.links.map(link => (
                <li key={link}>
                  <a href="#" className="text-xs text-white/40 hover:text-[#FFD700] 
                    transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mb-10 sm:mb-12 pt-7 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="text-center sm:text-left">
            <h3 className="font-['Bebas_Neue'] text-lg sm:text-xl text-white tracking-[2px]">
              JOIN THE COLLECTOR'S CIRCLE
            </h3>
            <p className="text-xs text-white/30 mt-1">
              New drops, exclusive deals — straight to your inbox.
            </p>
          </div>
          <div className="flex w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-white/10 border border-white/20 text-white placeholder-white/30 
                px-4 py-3 text-sm flex-1 sm:w-[240px] outline-none focus:border-[#FF3D00] transition-colors"
            />
            <button
              className="bg-[#FF3D00] text-white px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold tracking-widest 
                uppercase font-['Barlow_Condensed'] hover:bg-[#FF5500] transition-all whitespace-nowrap"
              style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-7 border-t border-white/10">
        <p className="text-[10px] sm:text-[11px] text-white/30 text-center md:text-left">
          © 2024 HotWheel Vault. Hot Wheels® is a trademark of Mattel, Inc. Not affiliated with Mattel.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['UPI', 'VISA', 'MC', 'RUPAY'].map(p => (
            <span key={p} className="bg-white/10 px-3 py-1 text-[10px] 
              text-white/50 tracking-wider font-semibold border border-white/10">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
