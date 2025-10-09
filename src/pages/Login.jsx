import { useState } from 'react'
import { isAuthed, login, logout } from '../lib/auth.js'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (login(username.trim(), password.trim())) {
      window.history.pushState({}, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else {
      setError('Invalid credentials')
    }
  }

  if (isAuthed()) {
    return (
      <div className="mx-auto max-w-sm px-4 sm:px-6 py-16 text-center">
        <p className="text-slate-700">You are logged in.</p>
        <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-white" onClick={() => { logout(); window.location.reload() }}>Logout</button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input className="rounded-md border border-slate-300 px-3 py-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="rounded-md border border-slate-300 px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-white">Login</button>
      </form>
    </div>
  )
}


