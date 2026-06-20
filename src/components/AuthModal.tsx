'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useUIStore } from '@/store/uiStore'

type Tab = 'signin' | 'signup'

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useUIStore()
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: err } = await supabaseBrowser.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Wrong email or password'
        : err.message)
    } else {
      closeAuthModal()
    }
    setLoading(false)
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    const { error: err } = await supabaseBrowser.auth.signUp({ email, password })
    if (err) {
      setError(err.message === 'User already registered'
        ? 'An account with this email already exists. Sign in instead.'
        : err.message)
    } else {
      setTab('signin')
      setPassword('')
      setConfirm('')
      setError('Check your email for a confirmation link, then sign in.')
    }
    setLoading(false)
  }

  async function handleMagicLink() {
    if (!email) { setError('Enter your email first'); return }
    setError('')
    setLoading(true)

    const { error: err } = await supabaseBrowser.auth.signInWithOtp({ email })
    if (err) {
      setError(err.message)
    } else {
      setMagicSent(true)
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-md p-8 relative">
              <button
                onClick={closeAuthModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#1A1A1A] text-2xl transition-colors"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <h2 className="font-['Bebas_Neue'] text-3xl text-[#1A1A1A] mb-2">
                  {tab === 'signin' ? 'SIGN IN' : 'SIGN UP'}
                </h2>
                <p className="text-gray-400 text-xs tracking-wide">
                  {tab === 'signin' ? 'Track orders, save addresses, checkout faster' : 'Create your account'}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => { setTab('signin'); setError('') }}
                  className={`flex-1 pb-3 text-sm font-bold font-['Barlow_Condensed'] tracking-widest uppercase transition-colors
                    ${tab === 'signin' ? 'text-[#FF3D00] border-b-2 border-[#FF3D00]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setTab('signup'); setError('') }}
                  className={`flex-1 pb-3 text-sm font-bold font-['Barlow_Condensed'] tracking-widest uppercase transition-colors
                    ${tab === 'signup' ? 'text-[#FF3D00] border-b-2 border-[#FF3D00]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Sign Up
                </button>
              </div>

              {magicSent ? (
                <div className="text-center py-6">
                  <span className="text-4xl block mb-4">📬</span>
                  <p className="text-gray-600 text-sm mb-2">Magic link sent!</p>
                  <p className="text-gray-400 text-xs">Check your email ({email}) for the sign-in link.</p>
                  <button
                    onClick={() => setMagicSent(false)}
                    className="mt-6 text-sm text-[#FF3D00] font-bold hover:underline"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-[#FF3D00] outline-none transition-colors bg-gray-50/50"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-[#FF3D00] outline-none transition-colors bg-gray-50/50"
                    />
                    {tab === 'signup' && (
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 text-sm border border-gray-200 focus:border-[#FF3D00] outline-none transition-colors bg-gray-50/50"
                      />
                    )}
                  </div>

                  {error && (
                    <p className={`mt-4 text-xs ${error.includes('Check your email') ? 'text-green-600' : 'text-red-500'}`}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-5 bg-[#FF3D00] text-white py-3 text-sm font-bold font-['Barlow_Condensed']
                      tracking-widest uppercase hover:bg-[#E03600] transition-colors disabled:opacity-50"
                  >
                    {loading ? (tab === 'signin' ? 'SIGNING IN...' : 'CREATING ACCOUNT...') : (tab === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT')}
                  </button>

                  {tab === 'signin' && (
                    <button
                      type="button"
                      onClick={handleMagicLink}
                      disabled={loading}
                      className="w-full mt-3 text-xs text-gray-400 hover:text-[#FF3D00] transition-colors underline underline-offset-2 disabled:opacity-50"
                    >
                      Send magic link instead
                    </button>
                  )}
                </form>
              )}

              <p className="text-center text-gray-400 text-[10px] mt-6 leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
