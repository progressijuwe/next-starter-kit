'use client';

import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

/**
 * Modal dialog, built on Radix Dialog.
 *
 * Radix supplies the hard parts: focus is trapped inside while open and
 * restored to the trigger on close, Escape and outside-clicks dismiss, and the
 * rest of the page is marked `aria-hidden` so screen readers can't wander out
 * of the dialog.
 *
 * `ModalTitle` is REQUIRED — Radix warns without one, and an untitled dialog is
 * announced as an anonymous group. Use `VisuallyHidden` if the design has no
 * visible heading.
 */
export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;
export const ModalPortal = DialogPrimitive.Portal;

export function ModalOverlay({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="modal-overlay"
            className={cn(
                'fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                className,
            )}
            {...props}
        />
    );
}

export interface ModalContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
    /** Hide the built-in close button when the footer supplies its own. */
    showCloseButton?: boolean;
}

export function ModalContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: ModalContentProps) {
    return (
        <ModalPortal>
            <ModalOverlay />
            <DialogPrimitive.Content
                data-slot="modal-content"
                className={cn(
                    'bg-card text-card-foreground fixed top-1/2 left-1/2 z-50 flex max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border p-6 shadow-xl',
                    /* Inset on both axes so the dialog never runs edge-to-edge
                       on a phone, and scrolls internally rather than growing
                       past a short viewport. */
                    'max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto',
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    className,
                )}
                {...props}
            >
                {children}

                {showCloseButton ? (
                    <DialogPrimitive.Close
                        data-slot="modal-close"
                        className="ring-offset-background focus-visible:ring-ring hover:bg-muted absolute top-4 right-4 rounded-md p-1 opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none"
                    >
                        <XIcon className="size-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                ) : null}
            </DialogPrimitive.Content>
        </ModalPortal>
    );
}

export function ModalHeader({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="modal-header"
            className={cn('flex flex-col gap-1.5 pr-8 text-left', className)}
            {...props}
        />
    );
}

export function ModalFooter({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="modal-footer"
            /* Stacked and reversed on mobile so the primary action sits at the
               bottom, under the thumb. */
            className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
            {...props}
        />
    );
}

export function ModalTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="modal-title"
            className={cn('text-h4 leading-none font-semibold', className)}
            {...props}
        />
    );
}

export function ModalDescription({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="modal-description"
            className={cn('text-small text-muted-foreground', className)}
            {...props}
        />
    );
}
