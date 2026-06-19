'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useAuthStore } from '@/store/authStore'

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

export default function AddressesPage() {
  const user = useAuthStore(s => s.user)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    loadAddresses()
  }, [user])

  async function loadAddresses() {
    if (!user) return
    const { data } = await supabaseBrowser
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
    if (data) setAddresses(data)
  }

  async function handleSave(id?: string) {
    setSaving(true)
    if (id) {
      await supabaseBrowser.from('addresses').update(form).eq('id', id)
      setEditingId(null)
    } else {
      await supabaseBrowser.from('addresses').insert({ user_id: user!.id, ...form })
      setShowNew(false)
    }
    setForm({ label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })
    await loadAddresses()
    setSaving(false)
  }

  async function handleSetDefault(id: string) {
    await supabaseBrowser.from('addresses').update({ is_default: false }).eq('user_id', user!.id)
    await supabaseBrowser.from('addresses').update({ is_default: true }).eq('id', id)
    await loadAddresses()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this address?')) return
    await supabaseBrowser.from('addresses').delete().eq('id', id)
    await loadAddresses()
  }

  function startEdit(addr: Address) {
    setEditingId(addr.id)
    setForm({ label: addr.label, full_name: addr.full_name, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode })
  }

  const formFields = (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Label</label>
        <select value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1">
          <option>Home</option><option>Work</option><option>Other</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Full Name</label>
        <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1" />
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Phone</label>
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1" />
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Pincode</label>
        <input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1" />
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Address Line 1</label>
        <input value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1" />
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">Address Line 2 (optional)</label>
        <input value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1" />
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">City</label>
        <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1" />
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed']">State</label>
        <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-[#FF3D00] outline-none mt-1" />
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-['Bebas_Neue'] text-2xl text-[#1A1A1A]">
          MY <span className="text-[#FF3D00]">ADDRESSES</span>
        </h2>
        {!showNew && (
          <button onClick={() => setShowNew(true)}
            className="text-xs text-[#FF3D00] font-bold tracking-wider uppercase font-['Barlow_Condensed'] hover:underline">
            + Add New
          </button>
        )}
      </div>

      {showNew && (
        <div className="bg-white border border-gray-200 p-4 mb-4 space-y-4">
          <h3 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider">New Address</h3>
          {formFields}
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave()} disabled={saving}
              className="bg-[#FF3D00] text-white px-5 py-2 text-xs font-bold tracking-[2px] uppercase
                font-['Barlow_Condensed'] hover:bg-[#FF5500] disabled:opacity-40 transition-all">
              {saving ? 'SAVING...' : 'SAVE'}
            </button>
            <button onClick={() => setShowNew(false)}
              className="text-gray-500 text-xs font-['Barlow_Condensed'] uppercase tracking-wider hover:text-[#1A1A1A]">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white border border-gray-200 p-4">
            {editingId === addr.id ? (
              <div className="space-y-4">
                {formFields}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleSave(addr.id)} disabled={saving}
                    className="bg-[#FF3D00] text-white px-5 py-2 text-xs font-bold tracking-[2px] uppercase
                      font-['Barlow_Condensed'] hover:bg-[#FF5500] disabled:opacity-40 transition-all">
                    {saving ? 'SAVING...' : 'SAVE'}
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="text-gray-500 text-xs font-['Barlow_Condensed'] uppercase tracking-wider hover:text-[#1A1A1A]">
                      Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF3D00] bg-[#FF3D00]/10 px-2 py-0.5">{addr.label}</span>
                  {addr.is_default && <span className="text-[10px] uppercase tracking-wider text-gray-400 border border-gray-200 px-2 py-0.5">DEFAULT</span>}
                </div>
                <p className="text-sm font-bold text-[#1A1A1A]">{addr.full_name}</p>
                <p className="text-xs text-gray-500">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                <p className="text-xs text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => startEdit(addr)}
                    className="text-xs text-[#FF3D00] hover:underline font-['Barlow_Condensed'] uppercase tracking-wider font-bold">Edit</button>
                  {!addr.is_default && (
                    <button onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-gray-500 hover:text-[#FF3D00] font-['Barlow_Condensed'] uppercase tracking-wider">Set as Default</button>
                  )}
                  <button onClick={() => handleDelete(addr.id)}
                    className="text-xs text-red-500 hover:underline font-['Barlow_Condensed'] uppercase tracking-wider">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {addresses.length === 0 && !showNew && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">No saved addresses</p>
          </div>
        )}
      </div>
    </div>
  )
}
