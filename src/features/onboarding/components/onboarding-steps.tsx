import { useFormContext } from 'react-hook-form'
import { Select } from '@/components/ui/select'
import { TextField } from '@/components/ui/text-field'
import { cn } from '@/lib/utils'
import type { OnboardingValues } from '@/features/profile/schemas/profile-schemas'

const GOAL_OPTIONS = [1500, 2000, 2500, 3000]
const AMOUNT_OPTIONS = [250, 330, 500, 600]

const FALLBACK_TIME_ZONES = [
  'Europe/Madrid',
  'Atlantic/Canary',
  'Europe/London',
  'Europe/Lisbon',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Mexico_City',
  'America/Bogota',
  'America/Argentina/Buenos_Aires',
  'America/Santiago',
]

const supportedValuesOf = (
  Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] }
).supportedValuesOf

const TIME_ZONES = supportedValuesOf ? supportedValuesOf('timeZone') : FALLBACK_TIME_ZONES

function AmountChips({
  options,
  value,
  onSelect,
}: {
  options: number[]
  value: number
  onSelect: (value: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          aria-pressed={value === option}
          className={cn(
            'rounded-full px-4 py-2 text-[15px] font-medium transition-colors',
            value === option
              ? 'bg-water-primary text-text-on-water'
              : 'bg-surface-muted text-text-primary hover:bg-border-soft',
          )}
        >
          {option} ml
        </button>
      ))}
    </div>
  )
}

export function NameStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingValues>()

  return (
    <TextField
      id="displayName"
      label="Tu nombre o alias"
      autoComplete="nickname"
      autoFocus
      error={errors.displayName?.message}
      {...register('displayName')}
    />
  )
}

export function GoalStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<OnboardingValues>()
  const value = watch('dailyGoalMl')

  return (
    <div className="flex flex-col gap-4">
      <AmountChips
        options={GOAL_OPTIONS}
        value={value}
        onSelect={(next) => setValue('dailyGoalMl', next, { shouldValidate: true })}
      />
      <TextField
        id="dailyGoalMl"
        label="Objetivo (ml)"
        type="number"
        inputMode="numeric"
        error={errors.dailyGoalMl?.message}
        {...register('dailyGoalMl', { valueAsNumber: true })}
      />
    </div>
  )
}

export function AmountStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<OnboardingValues>()
  const value = watch('defaultAmountMl')

  return (
    <div className="flex flex-col gap-4">
      <AmountChips
        options={AMOUNT_OPTIONS}
        value={value}
        onSelect={(next) => setValue('defaultAmountMl', next, { shouldValidate: true })}
      />
      <TextField
        id="defaultAmountMl"
        label="Cantidad rápida (ml)"
        type="number"
        inputMode="numeric"
        error={errors.defaultAmountMl?.message}
        {...register('defaultAmountMl', { valueAsNumber: true })}
      />
    </div>
  )
}

export function TimezoneStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingValues>()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="timezone" className="text-[14px] font-medium text-text-primary">
          Zona horaria
        </label>
        <Select id="timezone" {...register('timezone')}>
          {TIME_ZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
        {errors.timezone?.message ? (
          <p role="alert" className="text-[13px] text-error">
            {errors.timezone.message}
          </p>
        ) : null}
      </div>
      <p className="text-[14px] text-text-secondary">
        Unidad de medida: mililitros (ml).
      </p>
    </div>
  )
}
