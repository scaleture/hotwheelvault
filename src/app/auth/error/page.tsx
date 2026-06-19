import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="text-center max-w-md px-8">
        <span className="text-5xl block mb-6">❌</span>
        <h1 className="font-['Bebas_Neue'] text-4xl text-[#1A1A1A] mb-4">
          SIGN IN <span className="text-[#FF3D00]">FAILED</span>
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Something went wrong while signing you in. Please try again.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#FF3D00] text-white px-8 py-3 font-['Barlow_Condensed']
            text-sm tracking-[3px] uppercase font-bold hover:bg-[#FF5500] transition-all"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  )
}
