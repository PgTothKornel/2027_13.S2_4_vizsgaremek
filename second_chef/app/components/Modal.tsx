'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function Modal({ open, onClose, label, small = false, children }: { open: boolean; onClose: () => void; label: string; small?: boolean; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);
  return <dialog ref={dialog} className={`modal${small ? ' small-modal' : ''}`} aria-label={label} onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <button className="modal-close" aria-label="Bezárás" onClick={onClose}>×</button>
    {children}
  </dialog>;
}
