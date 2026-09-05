import type { ReactNode } from 'react'
import { Button } from './Button'
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" className="icon-button" onClick={onClose} aria-label="Close">
            x
          </Button>
        </div>
        {children}
      </section>
    </div>
  )
}
