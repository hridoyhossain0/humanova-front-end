'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, Save, X } from 'lucide-react';

import type { ManageEventDetails } from './EventDetailsModal';

export interface ManageEventFormValues {
    title: string;
    description: string;
    eventType: string;
    imageUrl: string;
    location: string;
    eventDate: string;
}

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

interface EditEventModalProps {
    event: ManageEventDetails;
    onClose: () => void;
    onSave: (values: ManageEventFormValues) => Promise<void>;
}

export default function EditEventModal({
    event,
    onClose,
    onSave,
}: EditEventModalProps) {
    const [values, setValues] = useState<ManageEventFormValues>({
        title: event.title || '',
        description: event.description || '',
        eventType: event.eventType || 'Community Service',
        imageUrl: event.imageUrl || '',
        location: event.location || '',
        eventDate: event.eventDate
            ? event.eventDate.slice(0, 10)
            : '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const update = (field: keyof ManageEventFormValues, value: string) => {
        setValues((current) => ({
            ...current,
            [field]: value,
        }));

        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!values.title.trim()) {
            setError('Please enter an event title.');
            return;
        }

        if (!values.eventDate) {
            setError('Please select an event date.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await onSave({
                ...values,
                title: values.title.trim(),
                location: values.location.trim(),
                description: values.description.trim(),
                imageUrl: values.imageUrl.trim(),
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Could not update the event.'
            );
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/60 p-4 backdrop-blur-sm sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${event.title}`}
            onClick={saving ? undefined : onClose}
        >
            <form
                onSubmit={handleSubmit}
                className="my-6 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-900">
                            Edit Event
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update the details of your event.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close edit form"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </div>

                {error && (
                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                        <AlertCircle size={17} />
                        {error}
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    <div>
                        <label
                            htmlFor="edit-title"
                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                            Event title
                        </label>
                        <input
                            id="edit-title"
                            value={values.title}
                            onChange={(e) => update('title', e.target.value)}
                            placeholder="Event title"
                            className={inputClass}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="edit-type"
                                className="mb-1.5 block text-sm font-semibold text-gray-700"
                            >
                                Event type
                            </label>
                            <select
                                id="edit-type"
                                value={values.eventType}
                                onChange={(e) =>
                                    update('eventType', e.target.value)
                                }
                                className={inputClass}
                            >
                                {eventTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="edit-date"
                                className="mb-1.5 block text-sm font-semibold text-gray-700"
                            >
                                Event date
                            </label>
                            <input
                                id="edit-date"
                                type="date"
                                value={values.eventDate}
                                onChange={(e) =>
                                    update('eventDate', e.target.value)
                                }
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="edit-location"
                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                            Location
                        </label>
                        <input
                            id="edit-location"
                            value={values.location}
                            onChange={(e) =>
                                update('location', e.target.value)
                            }
                            placeholder="Event location"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="edit-image"
                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                            Image URL
                        </label>
                        <input
                            id="edit-image"
                            value={values.imageUrl}
                            onChange={(e) =>
                                update('imageUrl', e.target.value)
                            }
                            placeholder="https://example.com/event-image.jpg"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="edit-description"
                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="edit-description"
                            rows={4}
                            value={values.description}
                            onChange={(e) =>
                                update('description', e.target.value)
                            }
                            placeholder="Describe your event"
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={17} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={17} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
