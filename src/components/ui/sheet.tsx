import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
}

// Bottom sheet sobre Radix Dialog: aporta focus trap, cierre con Escape y aria.
export function Sheet({ open, onOpenChange, title, description, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-50 bg-[rgb(17_19_24/0.32)]" />
        <Dialog.Content className="sheet-content fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-[28px] bg-surface pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-8px_40px_rgb(38_83_180/0.14)] focus:outline-none">
          <div className="flex justify-center pt-3">
            <span className="h-1.5 w-10 rounded-full bg-border-soft" aria-hidden="true" />
          </div>
          <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-3">
            <div className="flex flex-col gap-0.5">
              <Dialog.Title className="text-[20px] font-semibold text-text-primary">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="text-[14px] text-text-secondary">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close
              aria-label="Cerrar"
              className="grid size-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-primary/40"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto px-6 pb-4 pt-2">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
