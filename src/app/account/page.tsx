'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useAuthStore } from '@/store/authStore'

export default function ProfilePage() {
  const user = useAuthStore(s => s.user)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    setFullName(user.user_metadata?.full_name || '')
    supabaseBrowser
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || '')
          setPhone(data.phone || '')
        }
      })
  }, [user])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    await supabaseBrowser.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      phone,
    })
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="font-['Bebas_Neue'] text-2xl text-[#1A1A1A] mb-6">
        MY <span className="text-[#FF3D00]">PROFILE</span>
      </h2>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed'] mb-1">Email (read-only)</label>
          <input value={user?.email || ''} disabled
            className="w-full border border-gray-200 px-3 py-2.5 text-sm bg-gray-50 text-gray-400 outline-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed'] mb-1">Full Name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider font-['Barlow_Condensed'] mb-1">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#FF3D00] outline-none" />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF3D00] text-white px-6 py-2.5 text-sm font-bold tracking-[2px] uppercase
            font-['Barlow_Condensed'] hover:bg-[#FF5500] transition-all disabled:opacity-40"
        >
          {saving ? 'SAVING...' : saved ? '✓ SAVED' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  )
}
