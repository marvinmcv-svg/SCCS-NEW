"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Crest } from "../sccs/sccs-shared";

export type ModalRow = { label: string; body: React.ReactNode };

/**
 * The "Learn more" modal (§5.1): warm-grey overlay at 80%, a white panel that rises and
 * un-squashes into place, a 10px bar under the title, two-column rows divided by 3px rules,
 * and a hashtag + crest footer. Radix handles focus trapping, Esc, overlay clicks and scroll lock.
 */
export function LearnMoreModal({
  title,
  rows,
  trigger,
  hashtag = "#SCCSJaguars",
  closeLabel,
}: {
  title: string;
  rows: ModalRow[];
  trigger: React.ReactNode;
  hashtag?: string;
  closeLabel: string;
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="modal-overlay fixed inset-0 z-[80] bg-slate opacity-0" />
        <div className="fixed inset-0 z-[81] overflow-y-auto py-[max(48px,10vw)]">
          <DialogPrimitive.Content
            data-testid="learn-more-modal"
            className="modal-panel relative mx-auto w-[90%] max-w-[880px] overflow-hidden rounded-[var(--radius-card)] bg-white text-navy-950 md:w-[55.3vw] md:max-w-none"
          >
            {/* Inside the panel so it stays in the focus trap; the panel's own transform ends at none. */}
            <DialogPrimitive.Close
              aria-label={closeLabel}
              className="modal-close fixed right-[max(16px,2vw)] top-[max(16px,2vw)] z-[82] grid h-[45px] w-[45px] place-items-center text-[40px] font-light leading-none text-white"
            >
              ×
            </DialogPrimitive.Close>
            <header className="px-[max(24px,6.94vw)] pt-[max(32px,4.17vw)]">
              <DialogPrimitive.Title className="pb-[max(20px,2.08vw)] text-[clamp(24px,2.5vw,44px)] font-bold leading-[1.05] text-field-ink">{title}</DialogPrimitive.Title>
            </header>
            <div className="h-[10px] w-full bg-slate" aria-hidden="true" />
            <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
            <div>
              {rows.map((r, i) => (
                <div
                  key={r.label}
                  className="relative grid gap-3 px-[max(24px,6.94vw)] pb-[max(18px,2.08vw)] pt-[max(24px,3.47vw)] md:grid-cols-2 md:gap-8"
                >
                  {i > 0 && <span className="absolute inset-x-[max(24px,6.94vw)] top-0 h-[3px] bg-slate" aria-hidden="true" />}
                  <h3 className="text-[clamp(18px,1.667vw,30px)] font-semibold leading-tight text-field-ink">{r.label}</h3>
                  <div className="text-[clamp(15px,1.25vw,22px)] leading-[1.45] text-navy-900/80">{r.body}</div>
                </div>
              ))}
            </div>
            <footer className="flex items-end justify-between px-[max(24px,6.94vw)] pb-[max(24px,3vw)] pt-[max(24px,3vw)]">
              <span className="text-base font-medium text-slate">{hashtag}</span>
              <Crest className="h-[max(72px,8.9vw)] w-[max(72px,8.9vw)] max-h-32 max-w-32" />
            </footer>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
