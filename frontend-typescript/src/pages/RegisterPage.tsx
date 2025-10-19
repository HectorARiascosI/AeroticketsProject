import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useAuth } from '@/auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const schema = z.object({
  username: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'Mínimo 4 caracteres')
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data)
      toast.success('Cuenta creada, ahora inicia sesión')
      navigate('/login')
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible crear la cuenta')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Usuario" {...registerField('username')} error={errors.username?.message} />
          <Input label="Email" type="email" {...registerField('email')} error={errors.email?.message} />
          <Input label="Contraseña" type="password" {...registerField('password')} error={errors.password?.message} />
          <Button type="submit" loading={isSubmitting} className="w-full">Registrar</Button>
        </form>
        <div className="text-sm mt-3">
          <Link className="text-primary" to="/login">Tengo una cuenta</Link>
        </div>
      </Card>
    </div>
  )
}