'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#E8F5E9] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-6">🛒</span>
          <h1 className="font-['Bebas_Neue'] text-4xl text-[#1A1A1A] mb-4">
            YOUR CART IS <span className="text-[#FF3D00]">EMPTY</span>
          </h1>
          <Link
            href="/"
            className="inline-block bg-[#FF3D00] text-white px-8 py-3 font-['Barlow_Condensed']
              text-sm tracking-[3px] uppercase font-bold hover:bg-[#FF5500] transition-all"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-24">
        <h1 className="font-['Bebas_Neue'] text-5xl text-[#1A1A1A] mb-2">
          CHECK<span className="text-[#FF3D00]">OUT</span>
        </h1>
        <p className="text-gray-500 text-sm tracking-[3px] uppercase mb-12 font-['Barlow_Condensed']">
          Complete your purchase
        </p>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-4">
            <h2 className="font-['Bebas_Neue'] text-2xl text-[#1A1A1A] mb-4">
              ORDER <span className="text-[#FF3D00]">SUMMARY</span>
            </h2>
            {items.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-4 border border-gray-200">
                <div className="relative w-20 h-20 bg-[#F5F5F0] flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-['Barlow_Condensed'] text-sm font-bold text-[#1A1A1A]">
                    {item.name}
                  </div>
                  <div className="font-['Bebas_Neue'] text-xl text-[#FF3D00]">
                    ₹{item.price}
                  </div>
                  <div className="text-xs text-gray-400 tracking-wider uppercase">
                    Qty: {item.qty}
                  </div>
                </div>
                <div className="font-['Bebas_Neue'] text-xl text-[#1A1A1A] text-right">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}

            <div className="bg-white p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-['Barlow_Condensed'] text-sm tracking-[2px] uppercase text-gray-500">
                  Subtotal
                </span>
                <span className="font-['Bebas_Neue'] text-2xl text-[#1A1A1A]">
                  ₹{totalPrice().toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 text-green-700">
                <span className="font-['Barlow_Condensed'] text-sm tracking-[2px] uppercase">
                  Shipping
                </span>
                <span className="font-['Barlow_Condensed'] text-sm font-bold uppercase">
                  FREE
                </span>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-['Barlow_Condensed'] text-base tracking-[2px] uppercase font-bold text-[#1A1A1A]">
                  Total
                </span>
                <span className="font-['Bebas_Neue'] text-3xl text-[#FF3D00]">
                  ₹{totalPrice().toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block text-gray-400 text-xs tracking-[2px] uppercase font-['Barlow_Condensed']
                hover:text-[#FF3D00] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 p-6 sticky top-24">
              <h2 className="font-['Bebas_Neue'] text-2xl text-[#1A1A1A] mb-4">
                PAY<span className="text-[#FF3D00]">MENT</span>
              </h2>

              <p className="font-['Barlow_Condensed'] text-sm tracking-[2px] uppercase text-gray-500 mb-4">
                Scan to pay via UPI
              </p>

              <div className="relative w-full aspect-square bg-white border-2 border-dashed border-[#FF3D00]/30 p-4 mb-6">
                <Image
                  src="/images/payment-qr.jpeg"
                  alt="Payment QR Code"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain p-2"
                  priority
                />
              </div>

              <div className="bg-[#FFF8F5] border border-[#FF3D00]/20 p-4 mb-6">
                <h3 className="font-['Barlow_Condensed'] text-xs font-bold tracking-[3px] uppercase text-[#FF3D00] mb-3">
                  🔒 SECURE PAYMENT GUIDELINES
                </h3>
                <ul className="space-y-2">
                  {[
                    'Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM)',
                    'Enter the exact amount: ₹' + totalPrice().toLocaleString('en-IN'),
                    'Add your Order ID as payment reference',
                    'Send screenshot of successful payment to our WhatsApp',
                    'Your order will be confirmed within 15 minutes',
                    'We never ask for your UPI PIN or bank details',
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                      <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#FF3D00]/5 border border-[#FF3D00]/20 p-3">
                <p className="text-[10px] text-gray-500 tracking-wide leading-relaxed">
                  <strong className="text-[#FF3D00]">Important:</strong> Do not share your 
                  payment screenshot with anyone except our official WhatsApp. We are not 
                  responsible for payments made to unauthorized accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
