'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
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
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const eventTypes = [
    'Cleanup',
    'Plantation',
    'Donation',
    'Education',
    'Blood Donation',
    'Community Service',
    'Disaster Relief',
    'Other',
];

export default function CreateEventPage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: '',
        imageUrl: '',
        location: '',
        eventDate: '',
    });

    const [minDate, setMinDate] = useState('');

    useEffect(() => {
        // Calculate the minimum date in the browser's local timezone.
        const today = new Date();
        setMinDate([
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, '0'),
            String(today.getDate()).padStart(2, '0'),
        ].join('-'));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError('');

        if (!session?.user?.email) {
            setError('Please login before creating an event.');
            return;
        }

        // Validate future date.
        const selectedDate = new Date(
            `${formData.eventDate}T00:00:00`
        );

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate <= currentDate) {
            setError('Please select a future event date.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    createdByEmail: session.user.email,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to create event.'
                );
            }

            setSuccess(true);

            setTimeout(() => {
                router.push('/upcoming-events');
                router.refresh();
            }, 1500);

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
                <HeartHandshake size={48} className="text-emerald-600 mb-4" />
                <h2 className="text-2xl font-bold">Login Required</h2>
                <p className="text-gray-500 mt-2">
                    Please login to create a community event.
                </p>
                <Link
                    href="/sign-in"
                    className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700"
                >
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8faf9] dark:bg-gray-950 px-4 py-10 md:py-14">

            <div className="max-w-3xl mx-auto">

                {/* Back Navigation */}
                <Link
                    href="/upcoming-events"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-7 transition"
                >
                    <ArrowLeft size={17} />
                    Back to Upcoming Events
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 p-3 mb-4">
                        <HeartHandshake
                            size={27}
                            className="text-emerald-600"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Create an Event
                    </h1>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Make a difference in your community. Create an event
                        and bring people together.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5 md:p-8">

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Event Title */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                <Type size={16} className="text-emerald-600" />
                                Event Title
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Winter Clothes Distribution"
                                required
                                minLength={3}
                                maxLength={100}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:text-white transition"
                            />
                        </div>

                        {/* Event Type */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                <HeartHandshake size={16} className="text-emerald-600" />
                                Event Type
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:text-white transition"
                            >
                                <option value="">Select event category</option>

                                {eventTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                <FileText size={16} className="text-emerald-600" />
                                Event Description
                                <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your event, its purpose, activities and how people can participate..."
                                required
                                minLength={10}
                                rows={5}
                                maxLength={2000}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:text-white resize-none transition"
                            />

                            <p className="text-right text-xs text-gray-400 mt-1">
                                {formData.description.length}/2000
                            </p>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                <ImageIcon size={16} className="text-emerald-600" />
                                Thumbnail Image URL
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/event-image.jpg"
                                required
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:text-white transition"
                            />

                            {/* Image Preview */}
                            {formData.imageUrl && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <Image
                                        height={20}
                                        width={20}
                                        src={formData.imageUrl}
                                        alt="Event thumbnail preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                        onLoad={(e) => {
                                            e.currentTarget.style.display = 'block';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                <MapPin size={16} className="text-emerald-600" />
                                Event Location
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Mirpur 10, Dhaka, Bangladesh"
                                required
                                maxLength={200}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:text-white transition"
                            />
                        </div>

                        {/* Event Date */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                <CalendarDays size={16} className="text-emerald-600" />
                                Event Date
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                min={minDate}
                                required
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:text-white transition"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Only future dates are allowed.
                            </p>
                        </div>

                        {/* Creator Email */}
                        <div>
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">
                                Created By
                            </label>

                            <input
                                type="email"
                                value={session.user.email}
                                readOnly
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Your account email will be associated with this event.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 text-sm text-red-600">
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 text-sm text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 size={21} />
                                <div>
                                    <p className="font-semibold">
                                        Event created successfully!
                                    </p>
                                    <p className="text-xs mt-1">
                                        Redirecting to Upcoming Events...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row justify-end gap-3">

                            <Link
                                href="/upcoming-events"
                                className="rounded-xl border border-gray-200 dark:border-gray-700 px-6 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Creating Event...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle2 size={18} />
                                        Created Successfully
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Create Event
                                    </>
                                )}
                            </button>

                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Every small action creates a bigger impact. Thank you for
                    making a difference!
                </p>

            </div>
        </main>
    );
}
