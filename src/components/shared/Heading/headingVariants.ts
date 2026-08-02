import { cva } from 'class-variance-authority';

/**
 * Visual style only. The semantic level comes from Heading's `as` prop, which
 * is what keeps the document outline correct when a page's second section needs
 * to *look* like a display heading but *be* an `<h2>`.
 */
export const headingVariants = cva('text-pretty', {
    variants: {
        /* Maps onto the `--text-*` tokens in styles/tokens.css, which already
           carry their own line-height, tracking and weight. */
        size: {
            display: 'text-display',
            h1: 'text-h1',
            h2: 'text-h2',
            h3: 'text-h3',
            h4: 'text-h4',
        },

        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
        },

        muted: {
            true: 'text-muted-foreground',
            false: '',
        },
    },

    defaultVariants: {
        size: 'h2',
        align: 'left',
        muted: false,
    },
});
