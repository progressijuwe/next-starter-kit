import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().trim().min(2, 'Please tell us your name'),
    email: z.email('Enter a valid email address'),
    subject: z.string().trim().min(3, 'Add a short subject'),
    message: z
        .string()
        .trim()
        .min(20, 'Please give us a little more detail (20 characters minimum)')
        .max(2000, 'Message must be under 2000 characters'),
});

export type ContactInput = z.infer<typeof contactSchema>;
