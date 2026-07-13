import { Droplet, Pencil, Trash2 } from 'lucide-react'
import { formatEntryTime } from '../utils/dates'
import { formatMl } from '../utils/progress'
import type { HydrationEntry } from '../types'

type HydrationEntryRowProps = {
  entry: HydrationEntry
  timezone: string
  onEdit: (entry: HydrationEntry) => void
  onDelete: (entry: HydrationEntry) => void
}

export function HydrationEntryRow({
  entry,
  timezone,
  onEdit,
  onDelete,
}: HydrationEntryRowProps) {
  // Un registro optimista aún no tiene id real: no permitimos editarlo/borrarlo.
  const isPending = entry.id.startsWith('optimistic-')

  return (
    <li className="flex items-center gap-3 py-2">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-muted text-water-primary">
        <Droplet className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="text-[16px] font-medium tabular-nums text-text-primary">
          {formatMl(entry.amount_ml)} ml
        </span>
        <span className="text-[13px] text-text-secondary tabular-nums">
          {formatEntryTime(entry.consumed_at, timezone)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(entry)}
          disabled={isPending}
          aria-label={`Editar registro de ${formatMl(entry.amount_ml)} mililitros`}
          className="grid size-11 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-40"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry)}
          disabled={isPending}
          aria-label={`Eliminar registro de ${formatMl(entry.amount_ml)} mililitros`}
          className="grid size-11 place-items-center rounded-full text-text-secondary transition-colors hover:bg-error/10 hover:text-error disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
