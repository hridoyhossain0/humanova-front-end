'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getCurrentYear = () => new Date().getFullYear();
const getServerYear = () => 2026;

export default function CurrentYear() {
    const year = useSyncExternalStore(subscribe, getCurrentYear, getServerYear);

    return <>{year}</>;
}
