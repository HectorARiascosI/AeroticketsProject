import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useAuth } from '@/auth/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'Mínimo 4 caracteres')
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/flights'

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      navigate(from, { replace: true })
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
          <Button type="submit" loading={isSubmitting} className="w-full">Entrar</Button>
        </form>
        <div className="text-sm mt-3 flex justify-between">
          <Link className="text-primary" to="/register">Crear cuenta</Link>
          <Link className="text-primary" to="/forgot-password">Olvidé mi contraseña</Link>
        </div>
      </Card>
    </div>
  )
}