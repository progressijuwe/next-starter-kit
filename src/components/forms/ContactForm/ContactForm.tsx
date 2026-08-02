'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SendIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { api } from '@/services/api';
import { contactSchema, type ContactInput } from '@/validators/contact';

/**
 * Reference implementation for forms in this codebase: React Hook Form for
 * state, Zod for validation, TanStack Query for the request.
 *
 * Copy this shape for new forms — particularly the server-error handling,
 * which is the part most often left out.
 */
export function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
        /* Validate on blur, then re-validate on change once a field has already
           errored. Validating on every keystroke from the start shouts at
           people while they're still typing. */
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { name: '', email: '', subject: '', message: '' },
    });

    const mutation = useMutation({
        mutationFn: (values: ContactInput) => api.post<void>('/contact', values),
        onSuccess: () => reset(),
        onError: (error) => {
            /**
             * The server validates too, and it may know things the client
             * can't (a blocklisted domain, a duplicate). Replay its per-field
             * messages onto the matching inputs so they appear in context
             * rather than as one opaque banner.
             */
            if (error instanceof ApiError && error.fieldErrors) {
                for (const [field, messages] of Object.entries(error.fieldErrors)) {
                    if (field in contactSchema.shape && messages[0]) {
                        setError(field as keyof ContactInput, {
                            type: 'server',
                            message: messages[0],
                        });
                    }
                }
            }
        },
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    /* Only surface the banner for failures that aren't already shown per-field. */
    const showFormError =
        mutation.isError &&
        !(mutation.error instanceof ApiError && mutation.error.isValidationError);

    return (
        <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-4">
            {/* `noValidate` disables the browser's own bubbles so Zod's messages
                are the single source of truth — two validation systems
                disagreeing is worse than one. */}

            {isSubmitSuccessful && mutation.isSuccess ? (
                <Alert variant="success">
                    <AlertTitle>Message sent</AlertTitle>
                    <AlertDescription>We&apos;ll get back to you shortly.</AlertDescription>
                </Alert>
            ) : null}

            {showFormError ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t send your message</AlertTitle>
                    <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Name"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    error={errors.name?.message}
                    {...register('name')}
                />
                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="ada@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                />
            </div>

            <Input
                label="Subject"
                placeholder="How can we help?"
                error={errors.subject?.message}
                {...register('subject')}
            />

            <Textarea
                label="Message"
                rows={5}
                placeholder="Tell us a bit about your project…"
                description="At least 20 characters."
                error={errors.message?.message}
                {...register('message')}
            />

            <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Sending your message"
                rightIcon={<SendIcon />}
                className="sm:w-fit sm:self-end"
            >
                Send message
            </Button>
        </form>
    );
}
