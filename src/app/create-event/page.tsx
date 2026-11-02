"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
    CalendarDays,
    MapPin,
    Image as ImageIcon,
    Type,
    FileText,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    HeartHandshake,
    Upload,
    AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { toast } from "sonner";

const eventTypes = [
    "Cleanup",
    "Plantation",
    "Donation",
    "Education",
    "Blood Donation",
    "Community Service",
    "Disaster Relief",
    "Other",
];

const initialForm = {
    title: "",
    description: "",
    eventType: "",
    imageUrl: "",
    location: "",
    eventDate: "",
};



export default function CreateEventPage() {
    const router = useRouter();

    // Better Auth
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
   
    // Form
    const data = {
        username: user?.name,
        email: user?.email,
        image: user?.image,
        ...initialForm,
        createdAt: user?.createdAt
    }
    const [form, setForm] = useState(data);

     
    // UI states
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Update form
    const update = (
        field: keyof typeof form,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (error) {
            setError("");
        }
    };

    // Tomorrow date
    const getTomorrowDate = () => {
        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        return tomorrow
            .toISOString()
            .split("T")[0];
    };

    // Validate date
    const validateDate = () => {
        if (!form.eventDate) {
            return "Please select an event date.";
        }

        const selectedDate = new Date(
            `${form.eventDate}T00:00:00`
        );

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate <= today
        ) {
            return "Please select a future event date.";
        }

        return "";
    };

    // Submit
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const token = await getTokenFromClient();

        setError("");

        if (loading || success) {
            return;
        }

        // Authentication check
        if (!session?.user?.email) {
            const message =
                "Please login before creating an event.";

            setError(message);
            toast.error("Authentication required", {
                description: message,
            });
            return;
        }

        if (!token) {
            const message =
                "Authentication token not found. Please sign in again.";

            setError(message);
            toast.error("Authentication required", {
                description: message,
            });
            return;
        }

        // API URL
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            const message =
                "API URL is not configured. Please check your environment variables.";

            setError(message);
            toast.error("Configuration error", {
                description: message,
            });
            return;
        }

        // Date validation
        const dateError = validateDate();

        if (dateError) {
            setError(dateError);
            toast.warning("Check the event date", {
                description: dateError,
            });
            return;
        }

        const toastId = toast.loading("Creating your event...", {
            description: "Publishing your initiative to the community.",
        });

        try {
            setLoading(true);

            const res = await fetch(
                `${apiUrl}/create-event`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                        authorization: `Bearer ${token}`
                    },

                   

                    body: JSON.stringify({form}),
                }
            );

            const responseText =
                await res.text();

            console.log(responseText)

            let result: {
                success?: boolean;
                message?: string;
                event?: unknown;
            } = {};

            try {
                result = responseText
                    ? JSON.parse(responseText)
                    : {};
            } catch {
                throw new Error(
                    `Invalid server response (${res.status}).`
                );
            }

            console.log(
                "API Status:",
                res.status
            );

            console.log(
                "API Result:",
                result
            );

            if (!res.ok) {
                throw new Error(
                    result.message ||
                    `Failed to create event. Status: ${res.status}`
                );
            }

            // Success
            setSuccess(true);

            toast.success("Event created!", {
                id: toastId,
                description: `"${form.title}" is now live on Upcoming Events.`,
            });

            setForm((current) => ({
                ...current,
                ...initialForm,
            }));

            // The upcoming-events page fetches with `no-store`, so this
            // navigation loads the event that was just created.
            router.push("/upcoming-events");
        } catch (err) {
            console.error(
                "Create Event Error:",
                err
            );

            const message =
                err instanceof TypeError
                    ? "Unable to connect to the server. Check your API URL, backend server and CORS settings."
                    : err instanceof Error
                        ? err.message
                        : "Something went wrong. Please try again.";

            setError(message);

            toast.error("Could not create event", {
                id: toastId,
                description: message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Authentication loading
    if (isPending) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background">
                <Loader2
                    size={35}
                    className="animate-spin text-[#00A8E8]"
                />
            </main>
        );
    }

    // Login required
    if (!session?.user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-6">
                <div className="w-full max-w-md rounded-sm border border-border bg-white p-8 text-center shadow-sm">
                    <HeartHandshake
                        size={45}
                        className="mx-auto mb-4 text-[#00A8E8]"
                    />

                    <h2 className="text-2xl font-semibold">
                        Login Required
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Please login to create a
                        community event.
                    </p>

                    <Button
                        
                        className="mt-6 bg-[#00A8E8] text-white hover:bg-[#0095d1]"
                    >
                        <Link href="/sign-in">
                            Login Now
                        </Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-sky-50/70 via-background to-background px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-3xl">

                {/* Back */}
                <Link
                    href="/upcoming-events"
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition hover:border-sky-200 hover:text-sky-700 hover:shadow dark:hover:border-sky-900 dark:hover:text-sky-300"
                >
                    <ArrowLeft size={16} />
                    Back to Upcoming Events
                </Link>

                {/* Page heading */}
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    Create New Event
                </h1>

                <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                    Create a community event and
                    bring people together.
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none sm:p-9"
                >
                    <div className="grid gap-6">

                        {/* Event Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-sm font-semibold">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <Type size={16} />
                                    Event Title
                                </span>
                            </Label>

                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="e.g. Winter Clothes Distribution"
                                value={form.title}
                                onChange={(event) =>
                                    update(
                                        "title",
                                        event.target.value
                                    )
                                }
                                minLength={3}
                                maxLength={100}
                                required
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 shadow-sm transition focus-visible:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                            />
                        </div>

                        {/* Event Type */}
                        <div className="grid gap-2">
                            <Label className="text-sm font-semibold">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <HeartHandshake size={16} />
                                    Event Type
                                </span>
                            </Label>

                            <Select
                                value={form.eventType}
                                onValueChange={(value) =>
                                    update(
                                        "eventType",
                                        value ?? ""
                                    )
                                }
                            >
                                <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/50 px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                                    <SelectValue placeholder="Select event category" />
                                </SelectTrigger>

                                <SelectContent>
                                    {eventTypes.map(
                                        (type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                            >
                                                {type}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-sm font-semibold">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <FileText size={16} />
                                    Event Description
                                </span>
                            </Label>

                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe your event, its purpose, activities and how people can participate..."
                                className="min-h-36 rounded-xl border-slate-200 bg-slate-50/50 p-4 shadow-sm transition focus-visible:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                                value={form.description}
                                onChange={(event) =>
                                    update(
                                        "description",
                                        event.target.value
                                    )
                                }
                                minLength={10}
                                maxLength={2000}
                                required
                            />

                            <p className="text-right text-xs text-muted-foreground">
                                {form.description.length}
                                /2000
                            </p>
                        </div>

                        {/* Image URL */}
                        <div className="grid gap-2">
                            <Label htmlFor="imageUrl" className="text-sm font-semibold">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <ImageIcon size={16} />
                                    Thumbnail Image URL
                                </span>
                            </Label>

                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                placeholder="https://example.com/event-image.jpg"
                                value={form.imageUrl}
                                onChange={(event) =>
                                    update(
                                        "imageUrl",
                                        event.target.value
                                    )
                                }
                                required
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 shadow-sm transition focus-visible:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                            />

                            {/* Image Preview */}
                            {form.imageUrl && (
                                <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
                                    <Image
                                        src={form.imageUrl}
                                        alt="Event preview"
                                        width={800}
                                        height={400}
                                        className="h-52 w-full object-cover"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="grid gap-2">
                            <Label htmlFor="location" className="text-sm font-semibold">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <MapPin size={16} />
                                    Event Location
                                </span>
                            </Label>

                            <Input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="e.g. Mirpur 10, Dhaka, Bangladesh"
                                value={form.location}
                                onChange={(event) =>
                                    update(
                                        "location",
                                        event.target.value
                                    )
                                }
                                maxLength={200}
                                required
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 shadow-sm transition focus-visible:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                            />
                        </div>

                        {/* Event Date */}
                        <div className="grid gap-2">
                            <Label htmlFor="eventDate" className="text-sm font-semibold">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                    <CalendarDays size={16} />
                                    Event Date
                                </span>
                            </Label>

                            <Input
                                id="eventDate"
                                name="eventDate"
                                type="date"
                                min={getTomorrowDate()}
                                value={form.eventDate}
                                onChange={(event) =>
                                    update(
                                        "eventDate",
                                        event.target.value
                                    )
                                }
                                required
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 shadow-sm transition focus-visible:bg-white dark:border-slate-800 dark:bg-slate-900/50"
                            />

                            <p className="text-xs text-muted-foreground">
                                Only future dates are allowed.
                            </p>
                        </div>

                        {/* Created By */}
                        <div className="grid gap-2">
                            <Label htmlFor="creatorEmail" className="text-sm font-semibold">
                                Created By
                            </Label>

                            <Input
                                id="creatorEmail"
                                type="email"
                                value={
                                    session.user.email
                                }
                                readOnly
                                className="h-12 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100 px-4 text-slate-500 dark:border-slate-800 dark:bg-slate-900"
                            />

                            <p className="text-xs text-muted-foreground">
                                Your account email will be
                                associated with this event.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <p>{error}</p>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-600">
                                <CheckCircle2
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />

                                <div>
                                    <p className="font-semibold">
                                        Event created successfully!
                                    </p>

                                    <p className="mt-1 text-xs">
                                        Redirecting to Upcoming
                                        Events...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            
                            className="h-11 rounded-xl border-destructive/30 bg-background px-5 text-destructive hover:bg-destructive/5 hover:text-destructive"
                        >
                            <Link href="/upcoming-events" className="flex gap-1">
                                <ArrowLeft />
                                Cancel
                            </Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                loading || success
                            }
                            className="h-11 rounded-xl bg-[#00A8E8] px-6 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-[#0095d1] hover:shadow-sky-500/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Creating Event...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 />
                                    Created Successfully
                                </>
                            ) : (
                                <>
                                    <Upload />
                                    Create Event
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Footer */}
                <p className="mt-7 text-center text-xs leading-6 text-muted-foreground">
                    Every small action creates a
                    bigger impact. Thank you for
                    making a difference!
                </p>
            </div>
        </main>
    );
}
