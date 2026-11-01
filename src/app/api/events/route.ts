import { NextResponse } from 'next/server';

import { auth, db } from '@/lib/auth';

type EventInput = {
    title?: unknown;
    description?: unknown;
    eventType?: unknown;
    imageUrl?: unknown;
    location?: unknown;
    eventDate?: unknown;
};

class InputError extends Error {}

const requiredString = (value: unknown, field: string, maxLength: number) => {
    if (typeof value !== 'string') {
        throw new InputError(`${field} is required.`);
    }

    const trimmed = value.trim();

    if (!trimmed || trimmed.length > maxLength) {
        throw new InputError(`${field} must be between 1 and ${maxLength} characters.`);
    }

    return trimmed;
};

const getFutureDate = (value: unknown) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new InputError('A valid event date is required.');
    }

    const [year, month, day] = value.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (
        Number.isNaN(eventDate.getTime()) ||
        eventDate.getFullYear() !== year ||
        eventDate.getMonth() !== month - 1 ||
        eventDate.getDate() !== day ||
        eventDate <= today
    ) {
        throw new InputError('Event date must be in the future.');
    }

    return value;
};

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
        return NextResponse.json({ message: 'Authentication is required.' }, { status: 401 });
    }

    try {
        const input = (await request.json()) as EventInput;
        const imageUrl = requiredString(input.imageUrl, 'Image URL', 2_000);

        try {
            const url = new URL(imageUrl);

            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                throw new Error();
            }
        } catch {
            return NextResponse.json({ message: 'Image URL must be a valid HTTP(S) URL.' }, { status: 400 });
        }

        const event = {
            title: requiredString(input.title, 'Title', 100),
            description: requiredString(input.description, 'Description', 2_000),
            eventType: requiredString(input.eventType, 'Event type', 100),
            imageUrl,
            location: requiredString(input.location, 'Location', 200),
            eventDate: getFutureDate(input.eventDate),
            createdById: session.user.id,
            createdByEmail: session.user.email,
            registeredCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('events').insertOne(event);

        return NextResponse.json(
            { success: true, event: { ...event, _id: result.insertedId.toHexString() } },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
        }

        if (error instanceof InputError) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        console.error('Unable to create event:', error);

        return NextResponse.json({ message: 'Unable to create the event.' }, { status: 500 });
    }
}
