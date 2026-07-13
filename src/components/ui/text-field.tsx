import type { InputHTMLAttributes, Ref } from 'react'
import { Input } from './input'
import { Label } from './label'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

// Campo de formulario accesible: enlaza label, input y mensaje de error.
// Pensado para recibir el spread de React Hook Form: {...register('campo')}.
export function TextField({ id, label, error, ref, ...props }: TextFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-[13px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
