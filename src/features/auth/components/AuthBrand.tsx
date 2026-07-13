import { Droplet } from 'lucide-react'

export function AuthBrand() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-lg bg-water-primary text-text-on-water">
        <Droplet className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-[20px] font-semibold text-text-primary">Gota</span>
    </div>
  )
}
