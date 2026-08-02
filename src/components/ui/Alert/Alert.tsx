import { cva, type VariantProps } from 'class-variance-authority';
import {
    AlertCircleIcon,
    CheckCircle2Icon,
    InfoIcon,
    TriangleAlertIcon,
    type LucideIcon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
    'relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-small',
    {
        variants: {
            variant: {
                default: 'bg-card text-card-foreground border-border',
                info: 'bg-info/8 text-foreground border-info/25 [&>svg]:text-info',
                success: 'bg-success/8 text-foreground border-success/25 [&>svg]:text-success',
                warning: 'bg-warning/10 text-foreground border-warning/30 [&>svg]:text-warning',
                destructive:
                    'bg-destructive/8 text-foreground border-destructive/25 [&>svg]:text-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const defaultIcons: Record<string, LucideIcon> = {
    info: InfoIcon,
    success: CheckCircle2Icon,
    warning: TriangleAlertIcon,
    destructive: AlertCircleIcon,
};

export interface AlertProps
    extends Omit<ComponentProps<'div'>, 'role'>, VariantProps<typeof alertVariants> {
    /** Override the variant's default icon, or pass `null` for none. */
    icon?: ReactNode;
}

/**
 * Inline message block.
 *
 * The ARIA role follows the variant: `alert` for warnings and errors, which
 * interrupts a screen reader immediately, and `status` for everything else,
 * which waits for a pause. Marking a purely informational banner as `alert` is
 * the usual mistake — it talks over whatever the user was reading.
 */
export function Alert({ className, variant, icon, children, ...props }: AlertProps) {
    const isUrgent = variant === 'destructive' || variant === 'warning';
    const DefaultIcon = variant ? defaultIcons[variant] : undefined;

    /* `icon === null` is an explicit opt-out; `undefined` means "use the default". */
    const resolvedIcon =
        icon === undefined ? DefaultIcon && <DefaultIcon className="size-4" /> : icon;

    return (
        <div
            data-slot="alert"
            role={isUrgent ? 'alert' : 'status'}
            className={cn(alertVariants({ variant }), className)}
            {...props}
        >
            {resolvedIcon ? (
                <span aria-hidden="true" className="mt-0.5 flex [&>svg]:size-4">
                    {resolvedIcon}
                </span>
            ) : (
                /* Keep the text in the second column so multiple alerts align. */
                <span aria-hidden="true" />
            )}
            <div className="flex flex-col gap-1">{children}</div>
        </div>
    );
}

export function AlertTitle({ className, ...props }: ComponentProps<'p'>) {
    return (
        <p
            data-slot="alert-title"
            className={cn('font-medium tracking-tight', className)}
            {...props}
        />
    );
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-description"
            className={cn('text-muted-foreground [&_p]:leading-relaxed', className)}
            {...props}
        />
    );
}

export { alertVariants };
