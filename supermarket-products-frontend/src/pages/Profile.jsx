import { useCallback, useEffect, useState } from 'react'
import { Camera, Mail, Save, UserRound } from 'lucide-react'
import { apiRootClient } from '../services/apiClient'
import { useAuth } from '../context/AuthContext'
import { notifySuccess } from '../utils/alerts'
import { getErrorMessage, logApiError } from '../utils/errorHandler'

const emptyForm = { full_name: '', email: '', avatar: '' }

function profileUser(profile, fallback) {
  return profile?.user_id && typeof profile.user_id === 'object'
    ? profile.user_id
    : fallback
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError('')
    setLoadFailed(false)
    try {
      const response = await apiRootClient.get('/profile')
      const profile = response?.data?.data
      if (!profile) throw new Error('La API no devolvió un perfil válido.')
      const account = profileUser(profile, {})
      setForm({
        full_name: account?.full_name || '',
        email: account?.email || '',
        avatar: profile.avatar || '',
      })
    } catch (loadError) {
      logApiError(loadError, 'cargar perfil')
      setError(getErrorMessage(loadError))
      setLoadFailed(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const response = await apiRootClient.patch('/profile', {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        avatar: form.avatar.trim() || null,
      })
      const profile = response?.data?.data
      if (!profile) throw new Error('La API no devolvió el perfil actualizado.')
      const account = profileUser(profile, { full_name: form.full_name, email: form.email })
      setForm({
        full_name: account.full_name || form.full_name,
        email: account.email || form.email,
        avatar: profile.avatar || '',
      })
      updateUser({
        full_name: account.full_name,
        email: account.email,
        profile: { ...user?.profile, avatar: profile.avatar || null },
      })
      notifySuccess('Perfil actualizado', 'Tus datos se han guardado correctamente.')
    } catch (saveError) {
      logApiError(saveError, 'actualizar perfil')
      setError(getErrorMessage(saveError))
    } finally {
      setSaving(false)
    }
  }

  const initials = form.full_name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const avatarUrl = form.avatar.trim()

  if (loading) {
    return <div className="mx-auto max-w-5xl animate-pulse">
      <div className="mb-6 h-8 w-48 rounded-lg bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="panel h-72" />
        <div className="panel h-96" />
      </div>
    </div>
  }

  return <section className="mx-auto max-w-5xl">
    <div className="mb-7">
      <p className="text-sm font-semibold text-brand">Tu cuenta</p>
      <h2 className="mt-1 text-3xl font-bold">Mi perfil</h2>
      <p className="mt-2 text-sm text-slate-500">Gestiona la información personal de tu cuenta.</p>
    </div>

    {error && <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      <span>{error}</span>
      {loadFailed && <button type="button" onClick={loadProfile} className="font-bold underline">Reintentar</button>}
    </div>}

    <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="panel overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-brand to-emerald-800" />
        <div className="-mt-12 px-6 pb-6">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-3xl border-4 border-slate-100 bg-slate-200 text-2xl font-bold text-brand shadow-soft">
            {avatarUrl && !avatarError
              ? <img src={avatarUrl} alt="Avatar del perfil" className="h-full w-full object-cover" onError={() => setAvatarError(true)} />
              : initials || <UserRound size={34} />}
          </div>
          <h3 className="mt-4 text-lg font-bold">{form.full_name || 'Tu nombre'}</h3>
          <p className="mt-1 break-all text-sm text-slate-500">{form.email || user?.email}</p>
          <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <Camera size={15} /> Personaliza tu imagen desde el formulario.
          </div>
        </div>
      </aside>

      <form onSubmit={handleSubmit} className="panel p-5 md:p-8">
        <div className="mb-6 border-b border-slate-200 pb-5">
          <h3 className="text-lg font-bold">Información personal</h3>
          <p className="mt-1 text-sm text-slate-500">Los cambios se aplicarán a tu cuenta.</p>
        </div>

        <div className="grid gap-5">
          <div>
            <label htmlFor="profile-name" className="field-label">Nombre completo</label>
            <div className="relative">
              <UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="profile-name" name="full_name" value={form.full_name} onChange={handleChange} className="field pl-10" required minLength={2} autoComplete="name" />
            </div>
          </div>
          <div>
            <label htmlFor="profile-email" className="field-label">Correo electrónico</label>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="profile-email" name="email" type="email" value={form.email} onChange={handleChange} className="field pl-10" required autoComplete="email" />
            </div>
          </div>
          <div>
            <label htmlFor="profile-avatar" className="field-label">Imagen de perfil <span className="font-normal text-slate-400">(opcional)</span></label>
            <input id="profile-avatar" name="avatar" type="url" value={form.avatar} onChange={(event) => { setAvatarError(false); handleChange(event) }} className="field" placeholder="https://ejemplo.com/imagen.jpg" />
            <p className="mt-1.5 text-xs text-slate-500">Introduce una URL de imagen. Deja el campo vacío para quitarla.</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={saving} className="btn-primary min-w-40">
            <Save size={16} /> {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  </section>
}
