import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { resetPassword } from '@/services/authService'
import toast from 'react-hot-toast'

const schema = z.object({ password: z.string().min(4, 'Mínimo 4 caracteres') })
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(token!, data.password)
      toast.success('Contraseña actualizada')
      navigate('/login')
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible actualizar la contraseña')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-3">Nueva contraseña</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
          <Button type="submit" loading={isSubmitting} className="w-full">Actualizar</Button>
        </form>
      </Card>
    </div>
  )
}