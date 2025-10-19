import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { requestReset } from '@/services/authService'
import toast from 'react-hot-toast'

const schema = z.object({ email: z.string().email('Email inválido') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await requestReset(data.email)
      toast.success('Hemos enviado instrucciones a tu email')
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible procesar la solicitud')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-3">Recuperar contraseña</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Button type="submit" loading={isSubmitting} className="w-full">Enviar</Button>
        </form>
      </Card>
    </div>
  )
}