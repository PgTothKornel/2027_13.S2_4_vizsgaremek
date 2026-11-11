"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function Modal({
  open,
  onClose,
  label,
  small = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  small?: boolean;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className={`modal border-0 rounded-[30px] p-0 max-w-[min(1000px,calc(100%_-_32px))] w-full shadow-[0_30px_100px_rgba(22,40,44,.35)] bg-paper text-ink overflow-hidden backdrop:bg-[rgba(22,40,44,.65)] backdrop:backdrop-blur-[8px] max-[680px]:max-h-[92vh] max-[680px]:overflow-auto max-[680px]:rounded-3xl ${small ? " small-modal [&.small-modal]:max-w-[520px] [&.small-modal]:p-9 [&_h2]:font-display [&_h2]:text-[2.5rem] [&_h2]:font-normal [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-5 [&_form]:flex [&_form]:flex-col [&_form]:gap-4 [&_label]:text-[.78rem] [&_label]:font-bold [&_input]:block [&_input]:w-full [&_input]:[border:1px_solid_var(--color-line)] [&_input]:rounded-xl [&_input]:p-[13px] [&_input]:mt-[7px] [&_input]:bg-white [&_select]:block [&_select]:w-full [&_select]:[border:1px_solid_var(--color-line)] [&_select]:rounded-xl [&_select]:p-[13px] [&_select]:mt-[7px] [&_select]:bg-white max-[680px]:[&.small-modal]:py-7.5 max-[680px]:[&.small-modal]:px-5" : ""}`}
      aria-label={label}
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        className="modal-close absolute right-4 top-4 z-2 w-10.5 h-10.5 border-0 rounded-full bg-[rgba(247,244,239,.92)] text-[1.7rem] cursor-pointer"
        aria-label="Bezárás"
        onClick={onClose}
      >
        ×
      </button>
      {children}
    </dialog>
  );
}
