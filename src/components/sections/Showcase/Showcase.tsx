import { CheckIcon, MailIcon, SearchIcon, TrashIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { ContactForm } from '@/components/forms/ContactForm';
import { Container } from '@/components/shared/Container';
import { Divider } from '@/components/shared/Divider';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/Accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
    Modal,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/Textarea';
import { getInitials } from '@/utils/string';

/**
 * A living style guide.
 *
 * Every token and component rendered on one page, which makes it a smoke test:
 * if theming, focus styles or dark mode break, it shows here first. Delete this
 * file (and its route) when you start a real project.
 *
 * Note this is a Server Component — the interactive pieces (Modal, Tabs,
 * Accordion, ContactForm) carry their own `'use client'`, so only they ship JS.
 */

function Block({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <Heading as="h3" size="h4">
                {title}
            </Heading>
            {children}
        </div>
    );
}

const SWATCHES = [
    ['bg-background border', 'background'],
    ['bg-foreground', 'foreground'],
    ['bg-primary', 'primary'],
    ['bg-secondary', 'secondary'],
    ['bg-muted', 'muted'],
    ['bg-accent', 'accent'],
    ['bg-success', 'success'],
    ['bg-warning', 'warning'],
    ['bg-info', 'info'],
    ['bg-destructive', 'destructive'],
] as const;

export function Showcase() {
    return (
        <Section id="components" spacing="2xl" surface="muted">
            <Container className="flex flex-col gap-12">
                <div className="flex flex-col gap-2">
                    <Heading as="h2" size="h2">
                        Design system
                    </Heading>
                    <Text muted balance>
                        Every token and primitive in one place. Toggle the theme in the header —
                        nothing here hardcodes a colour, so all of it should follow.
                    </Text>
                </div>

                <Block title="Typography">
                    <div className="flex flex-col gap-3">
                        <Heading as="p" size="display">
                            Display
                        </Heading>
                        <Heading as="p" size="h1">
                            Heading 1
                        </Heading>
                        <Heading as="p" size="h2">
                            Heading 2
                        </Heading>
                        <Heading as="p" size="h3">
                            Heading 3
                        </Heading>
                        <Heading as="p" size="h4">
                            Heading 4
                        </Heading>
                        <Text size="body">Body — the default for running prose.</Text>
                        <Text size="small" muted>
                            Small — secondary detail and helper text.
                        </Text>
                        <Text size="caption" muted>
                            CAPTION — labels, metadata, timestamps.
                        </Text>
                    </div>
                </Block>

                <Divider />

                <Block title="Colour">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {SWATCHES.map(([className, name]) => (
                            <div key={name} className="flex flex-col gap-1.5">
                                <div className={`h-14 rounded-lg ${className}`} />
                                <Text size="caption" muted>
                                    {name}
                                </Text>
                            </div>
                        ))}
                    </div>
                </Block>

                <Divider />

                <Block title="Buttons">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="link">Link</Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button size="sm">Small</Button>
                        <Button>Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon" aria-label="Delete item">
                            <TrashIcon />
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button leftIcon={<MailIcon />}>With left icon</Button>
                        <Button variant="outline" rightIcon={<CheckIcon />}>
                            With right icon
                        </Button>
                        <Button isLoading>Loading</Button>
                        <Button disabled>Disabled</Button>
                    </div>

                    <Button fullWidth variant="secondary">
                        Full width
                    </Button>
                </Block>

                <Divider />

                <Block title="Badges">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="success">Active</Badge>
                        <Badge variant="warning">Pending</Badge>
                        <Badge variant="destructive">Failed</Badge>
                        <Badge variant="info">Beta</Badge>
                    </div>
                </Block>

                <Divider />

                <Block title="Alerts">
                    <div className="flex flex-col gap-3">
                        <Alert>
                            <AlertTitle>Heads up</AlertTitle>
                            <AlertDescription>
                                A neutral message with no particular urgency.
                            </AlertDescription>
                        </Alert>
                        <Alert variant="info">
                            <AlertTitle>Did you know?</AlertTitle>
                            <AlertDescription>
                                Informational alerts use role=&quot;status&quot;, so they wait for a
                                pause before being announced.
                            </AlertDescription>
                        </Alert>
                        <Alert variant="success">
                            <AlertTitle>Saved</AlertTitle>
                            <AlertDescription>Your changes have been published.</AlertDescription>
                        </Alert>
                        <Alert variant="warning">
                            <AlertTitle>Check your billing details</AlertTitle>
                            <AlertDescription>
                                Your card expires at the end of the month.
                            </AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                            <AlertTitle>Upload failed</AlertTitle>
                            <AlertDescription>
                                The file exceeds the 10&nbsp;MB limit.
                            </AlertDescription>
                        </Alert>
                    </div>
                </Block>

                <Divider />

                <Block title="Form controls">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="Email" type="email" placeholder="ada@example.com" />
                        <Input label="Search" leftIcon={<SearchIcon />} placeholder="Search…" />
                        <Input
                            label="Username"
                            description="Letters, numbers and hyphens only."
                            placeholder="ada-lovelace"
                        />
                        <Input
                            label="Password"
                            type="password"
                            defaultValue="short"
                            error="Password must be at least 8 characters"
                        />
                    </div>
                    <Textarea label="Notes" placeholder="Anything else we should know?" />
                </Block>

                <Divider />

                <Block title="Cards, avatars and spinners">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Starter plan</CardTitle>
                                <CardDescription>Everything you need to begin.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Text size="small" muted>
                                    Cards are composed from parts, so you only render the pieces you
                                    actually need.
                                </Text>
                            </CardContent>
                            <CardFooter>
                                <Button size="sm">Choose plan</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Team</CardTitle>
                                <CardDescription>Fallbacks when an image fails.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage
                                        src="https://i.pravatar.cc/96?img=5"
                                        alt="Ada Lovelace"
                                    />
                                    <AvatarFallback>{getInitials('Ada Lovelace')}</AvatarFallback>
                                </Avatar>
                                <Avatar size="lg">
                                    {/* No src: falls back to initials immediately. */}
                                    <AvatarFallback>{getInitials('Grace Hopper')}</AvatarFallback>
                                </Avatar>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Loading states</CardTitle>
                                <CardDescription>Sizes xs through xl.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Spinner size="xs" label={null} />
                                <Spinner size="sm" label={null} />
                                <Spinner label={null} />
                                <Spinner size="lg" label={null} />
                                <Spinner size="xl" label="Loading examples" />
                            </CardContent>
                        </Card>
                    </div>
                </Block>

                <Divider />

                <Block title="Tabs, accordion and modal">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                            <Tabs defaultValue="overview">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="pt-4">
                                    <Text size="small" muted>
                                        Arrow keys move between tabs; Tab moves into the panel.
                                    </Text>
                                </TabsContent>
                                <TabsContent value="activity" className="pt-4">
                                    <Text size="small" muted>
                                        Only the active tab is in the tab order.
                                    </Text>
                                </TabsContent>
                                <TabsContent value="settings" className="pt-4">
                                    <Text size="small" muted>
                                        Panels are lazily revealed, not unmounted.
                                    </Text>
                                </TabsContent>
                            </Tabs>

                            <Modal>
                                <ModalTrigger asChild>
                                    <Button variant="outline">Open modal</Button>
                                </ModalTrigger>
                                <ModalContent>
                                    <ModalHeader>
                                        <ModalTitle>Delete project</ModalTitle>
                                        <ModalDescription>
                                            This permanently removes the project and all of its
                                            data. This can&apos;t be undone.
                                        </ModalDescription>
                                    </ModalHeader>
                                    <ModalFooter>
                                        <Button variant="ghost">Cancel</Button>
                                        <Button variant="destructive">Delete project</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </div>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="a11y">
                                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                                <AccordionContent>
                                    Yes. Every interactive primitive is built on Radix, which
                                    handles focus management, keyboard interaction and ARIA.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="theme">
                                <AccordionTrigger>How does theming work?</AccordionTrigger>
                                <AccordionContent>
                                    CSS variables defined once per theme in styles/tokens.css, and
                                    mapped into Tailwind&apos;s colour namespace.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="ship">
                                <AccordionTrigger>Can I delete this page?</AccordionTrigger>
                                <AccordionContent>
                                    Please do — it exists to prove the system works, not to ship.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </Block>

                <Divider label="and finally" />

                <Block title="A real form">
                    <Text size="small" muted className="max-w-2xl">
                        React Hook Form plus Zod, with server-side field errors replayed onto the
                        matching inputs. Submitting posts to <code>/contact</code>, which
                        doesn&apos;t exist yet — so it demonstrates the error path.
                    </Text>
                    <Card>
                        <CardContent className="pt-6">
                            <ContactForm />
                        </CardContent>
                    </Card>
                </Block>
            </Container>
        </Section>
    );
}
