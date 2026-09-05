import { useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
export function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (email) login(email)
  }
  return (
    <form onSubmit={submit}>
      <label className="form-field">
        Email
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>
      <Button type="submit">Sign in</Button>
    </form>
  )
}
