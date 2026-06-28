'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

const COUPONS: Record<string, number> = {
  SPEED20: 20,
  VAULT10: 10,
  FIRSTORDER: 15,
}

const STEPS = ['Delivery Address', 'Review Order', 'Confirmation']

interface Address {
  id: string
  label: string
  full_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const { items, totalPrice, clearCart } = useCartStore()

  const [step, setStep] = useState(0)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [paymentMethod] = useState('online')
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)

  const [newAddr, setNewAddr] = useState({
    label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })
  const [savingAddr, setSavingAddr] = useState(false)

  const subtotal = totalPrice()
  const shipping = subtotal >= 999 ? 0 : 49
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount / 100) : 0
  const total = subtotal + shipping - discount

  const loadAddresses = useCallback(async () => {
    if (!user) return
    const { data } = await supabaseBrowser
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
    if (data) {
      setAddresses(data)
      const defaultAddr = data.find(a => a.is_default)
      if (defaultAddr && !selectedAddressId) setSelectedAddressId(defaultAddr.id)
    }
  }, [user, selectedAddressId])

  useEffect(() => { if (user) loadAddresses() }, [user, loadAddresses])

  useEffect(() => {
    if (!items.length) {
      router.replace('/')
    }
  }, [items, router])

  if (items.length === 0) return null

  async function handleSaveAddress() {
    if (!user) return
    setSavingAddr(true)
    const { data, error } = await supabaseBrowser
      .from('addresses')
      .insert({ user_id: user.id, ...newAddr })
      .select()
      .single()
    if (!error && data) {
      setAddresses(prev => [...prev, data])
      setSelectedAddressId(data.id)
      setShowNewAddress(false)
      setNewAddr({ label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })
    }
    setSavingAddr(false)
  }

  function handleApplyCoupon() {
    const code = couponCode.trim().toUpperCase()
    if (COUPONS[code]) {
      setAppliedCoupon({ code, discount: COUPONS[code] })
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId || !user) return
    setPlacing(true)
    setOrderError('')

    const orderData = {
      user_id: user.id,
      address_id: selectedAddressId,
      status: 'pending',
      payment_method: paymentMethod,
      subtotal,
      shipping,
      discount,
      total,
      coupon_code: appliedCoupon?.code || null,
    }

    const { data: order, error: orderErr } = await supabaseBrowser
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderErr || !order) {
      setOrderError(orderErr?.message || 'Failed to place order')
      setPlacing(false)
      return
    }

    const orderItems = items.map(i => ({
      order_id: order.id,
      product_id: i.id,
      product_name: i.name,
      product_image: i.image,
      price: i.price,
      qty: i.qty,
    }))

    const { error: itemsErr } = await supabaseBrowser
      .from('order_items')
      .insert(orderItems)

    if (itemsErr) {
      setOrderError('Order created but failed to save items. Contact support.')
      setPlacing(false)
      return
    }

    clearCart()
    setPlacedOrderId(order.id)
    setStep(2)
    setPlacing(false)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold
            ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#FF3D00] text-white' : 'bg-gray-200 text-gray-500'}`}>
            {i < step ? '✓' : i + 1}
          </div>
          <span className={`text-[10px] sm:text-xs font-['Barlow_Condensed'] tracking-wider uppercase
            ${i === step ? 'text-[#FF3D00]' : 'hidden sm:block text-gray-400'}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && <div className={`w-6 sm:w-12 h-px ${i < step ? 'bg-[#FF3D00]' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )

  if (placedOrderId) {
    return (
      <div className="min-h-screen bg-[#E8F5E9] flex items-center justify-center">
        <div className="text-center max-w-md px-6 sm:px-8">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6"
            style={{ animation: 'none' }}>
            <svg className="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-[#1A1A1A] mb-2">
            ORDER PLACED! <span className="text-[#FF3D00]">🎉</span>
          </h1>
          <p className="font-mono text-sm text-gray-500 mb-2">
            #{placedOrderId.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-gray-400 text-xs mb-8">
            You&apos;ll receive updates on your registered email
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/orders"
              className="bg-[#FF3D00] text-white px-6 py-3 text-sm font-bold tracking-[3px] uppercase
                font-['Barlow_Condensed'] hover:bg-[#FF5500] transition-all text-center">
              TRACK MY ORDER
            </Link>
            <Link href="/"
              className="border border-gray-300 text-gray-600 px-6 py-3 text-sm font-bold tracking-[3px]
                uppercase font-['Barlow_Condensed'] hover:border-[#FF3D00] hover:text-[#FF3D00] transition-all text-center">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
        <Link href="/" className="text-gray-400 text-xs tracking-[2px] uppercase font-['Barlow_Condensed']
          hover:text-[#FF3D00] transition-colors mb-6 inline-block">
          ← BACK TO SHOP
        </Link>

        <h1 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-[#1A1A1A] mb-8">
          CHECK<span className="text-[#FF3D00]">OUT</span>
        </h1>

        {renderStepIndicator()}

        {orderError && (
          <div className="bg-red-50 border border-red-200 px-5 py-4 mb-6">
            <p className="text-red-600 text-xs font-['Barlow_Condensed'] uppercase tracking-wider">{orderError}</p>
          </div>
        )}

        {/* Step 1: Address */}
        {step === 0 && (
          <div>
            <div className="space-y-3 mb-6">
              {addresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`w-full text-left p-4 border-2 transition-all bg-white
                    ${selectedAddressId === addr.id ? 'border-[#FF3D00]' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${selectedAddressId === addr.id ? 'border-[#FF3D00]' : 'border-gray-300'}`}>
                      {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-[#FF3D00]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF3D00] bg-[#FF3D00]/10 px-2 py-0.5">
                          {addr.label}
                        </span>
                        {addr.is_default && <span className="text-[10px] uppercase tracking-wider text-gray-400">DEFAULT</span>}
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] mt-1">{addr.full_name}</p>
                      <p className="text-xs text-gray-500">{addr.line1}, {addr.city}, {addr.state} — {addr.pincode}</p>
                      <p className="text-xs text-gray-400">{addr.phone}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {showNewAddress ? (
              <div className="bg-white border border-gray-200 p-4 sm:p-6 mb-6 space-y-4">
                <h3 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider">New Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Label</label>
                    <select value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1">
                      <option>Home</option>
                      <option>Work</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Full Name</label>
                    <input value={newAddr.full_name} onChange={e => setNewAddr({ ...newAddr, full_name: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Phone</label>
                    <input value={newAddr.phone} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Pincode</label>
                    <input value={newAddr.pincode} onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Address Line 1</label>
                    <input value={newAddr.line1} onChange={e => setNewAddr({ ...newAddr, line1: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Address Line 2 (optional)</label>
                    <input value={newAddr.line2} onChange={e => setNewAddr({ ...newAddr, line2: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">City</label>
                    <input value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">State</label>
                    <input value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none mt-1" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveAddress} disabled={savingAddr}
                    className="bg-[#FF3D00] text-white px-6 py-2.5 text-sm font-bold tracking-[2px] uppercase
                      font-['Barlow_Condensed'] hover:bg-[#FF5500] disabled:opacity-40 transition-all">
                    {savingAddr ? 'SAVING...' : 'SAVE ADDRESS'}
                  </button>
                  <button onClick={() => setShowNewAddress(false)}
                    className="text-gray-500 text-sm font-['Barlow_Condensed'] uppercase tracking-wider hover:text-[#1A1A1A]">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowNewAddress(true)}
                className="w-full border-2 border-dashed border-gray-300 p-4 text-sm text-gray-500
                  hover:border-[#FF3D00]/40 hover:text-[#FF3D00] transition-all font-['Barlow_Condensed']
                  uppercase tracking-wider font-bold mb-6">
                + ADD NEW ADDRESS
              </button>
            )}

            <button
              onClick={() => setStep(1)}
              disabled={!selectedAddressId}
              className="bg-[#FF3D00] text-white px-8 py-3 text-sm font-bold tracking-[3px] uppercase
                font-['Barlow_Condensed'] hover:bg-[#FF5500] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              USE THIS ADDRESS
            </button>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 1 && (
          <div className="grid md:grid-cols-5 gap-6 sm:gap-8">
            <div className="md:col-span-3 space-y-4">
              <h2 className="font-['Bebas_Neue'] text-xl sm:text-2xl text-[#1A1A1A] mb-4">
                ORDER <span className="text-[#FF3D00]">ITEMS</span>
              </h2>
              {items.map(item => (
                <div key={item.id} className="flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 border border-gray-200">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#F5F5F0] flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-['Barlow_Condensed'] text-sm font-bold text-[#1A1A1A] truncate">{item.name}</div>
                    <div className="font-['Bebas_Neue'] text-base sm:text-lg text-[#FF3D00]">₹{item.price}</div>
                    <div className="text-xs text-gray-400">Qty: {item.qty}</div>
                  </div>
                  <div className="font-['Bebas_Neue'] text-base sm:text-lg text-[#1A1A1A] flex-shrink-0">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                </div>
              ))}

              <div className="bg-white border border-gray-200 p-4">
                <h3 className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  DELIVERING TO
                </h3>
                {addresses.find(a => a.id === selectedAddressId) && (
                  <div className="text-sm text-[#1A1A1A]">
                    <p className="font-bold">{addresses.find(a => a.id === selectedAddressId)!.full_name}</p>
                    <p className="text-gray-500">{addresses.find(a => a.id === selectedAddressId)!.line1}</p>
                    <p className="text-gray-500">{addresses.find(a => a.id === selectedAddressId)!.city} — {addresses.find(a => a.id === selectedAddressId)!.pincode}</p>
                  </div>
                )}
                <button onClick={() => setStep(0)} className="text-xs text-[#FF3D00] hover:underline mt-2 font-['Barlow_Condensed'] uppercase tracking-wider">
                  Change
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="bg-white border border-gray-200 p-4">
                <h3 className="font-['Bebas_Neue'] text-lg sm:text-xl text-[#1A1A1A] mb-4">COUPON</h3>
                <div className="flex gap-2">
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none uppercase" />
                  <button onClick={handleApplyCoupon}
                    className="bg-[#1A1A1A] text-white px-4 text-xs font-bold tracking-[2px] uppercase
                      font-['Barlow_Condensed'] hover:bg-[#FF3D00] transition-all">
                    APPLY
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-green-600 text-xs mt-2 font-['Barlow_Condensed']">
                    ✓ {appliedCoupon.code} applied — ₹{discount} off!
                  </p>
                )}
                {couponError && (
                  <p className="text-red-500 text-xs mt-2 font-['Barlow_Condensed']">{couponError}</p>
                )}
              </div>

              <div className="bg-white border border-gray-200 p-4">
                <h3 className="font-['Bebas_Neue'] text-lg sm:text-xl text-[#1A1A1A] mb-4">ORDER TOTAL</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-['Bebas_Neue'] text-xl sm:text-2xl text-[#1A1A1A]">
                    <span>Total</span>
                    <span className="text-[#FF3D00]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-4">
                <h3 className="font-['Bebas_Neue'] text-lg sm:text-xl text-[#1A1A1A] mb-2">PAYMENT METHOD</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-['Barlow_Condensed']">💳 Pay Online (UPI/Card)</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full bg-[#FF3D00] text-white py-4 font-['Bebas_Neue'] text-lg sm:text-xl tracking-[3px]
                  hover:bg-[#FF5500] transition-all hover:-translate-y-0.5 active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
              >
                {placing ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation (shown after place order redirects here) */}
        {step === 2 && !placedOrderId && (
          <p className="text-center text-gray-500 py-12">Processing...</p>
        )}
      </div>
    </div>
  )
}
