import { GlobalAlert } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { useErVeileder } from '../../Provider';

export const VM_KAMP_START = new Date('2026-07-11T23:00:00+02:00');
const VM_ALERT_DISMISSED_KEY = 'intern_vm_alert_dismissed';

const getRemainingMs = (now: Date) => VM_KAMP_START.getTime() - now.getTime();

const isDismissed = () => {
    return window.localStorage.getItem(VM_ALERT_DISMISSED_KEY) === 'true';
};

const saveDismissed = () => {
    window.localStorage.setItem(VM_ALERT_DISMISSED_KEY, 'true');
};

const NorwegianFlagIcon = () => {
    return (
        <svg aria-hidden viewBox="0 0 22 16" className="h-4 w-5 rounded-sm shrink-0">
            <rect width="22" height="16" fill="#EF2B2D" />
            <rect x="6" width="4" height="16" fill="#FFFFFF" />
            <rect y="6" width="22" height="4" fill="#FFFFFF" />
            <rect x="7" width="2" height="16" fill="#002868" />
            <rect y="7" width="22" height="2" fill="#002868" />
        </svg>
    );
};

export const formatCountdown = (remainingMs: number): string => {
    const totalSeconds = Math.floor(remainingMs / 1000);

    if (totalSeconds <= 0) {
        return '';
    }

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];

    if (days > 0) {
        parts.push(`${days} dag${days === 1 ? '' : 'er'}`);
    }

    if (hours > 0 || days > 0) {
        parts.push(`${hours} time${hours === 1 ? '' : 'r'}`);
    }

    if (minutes > 0 || hours > 0 || days > 0) {
        parts.push(`${minutes} minutt${minutes === 1 ? '' : 'er'}`);
    }

    parts.push(`${seconds} sekund${seconds === 1 ? '' : 'er'}`);

    return parts.join(' ');
};

const InternVmAlertStripe = () => {
    const erVeileder = useErVeileder();
    const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(new Date()));
    const [dismissed, setDismissed] = useState(isDismissed);

    useEffect(() => {
        if (!erVeileder || dismissed) {
            return;
        }

        setRemainingMs(getRemainingMs(new Date()));

        const interval = setInterval(() => {
            setRemainingMs(getRemainingMs(new Date()));
        }, 1000);

        return () => clearInterval(interval);
    }, [dismissed, erVeileder]);

    const handleDismiss = () => {
        saveDismissed();
        setDismissed(true);
    };

    if (!erVeileder || dismissed || remainingMs <= 0) {
        return null;
    }

    const countdownText = formatCountdown(remainingMs);

    return (
        <GlobalAlert status="announcement" centered={false}>
            <GlobalAlert.Header>
                <GlobalAlert.Title className="flex items-center gap-2">
                    Norge er videre i VM!
                    <NorwegianFlagIcon />
                </GlobalAlert.Title>
                <GlobalAlert.CloseButton onClick={handleDismiss} />
            </GlobalAlert.Header>
            <GlobalAlert.Content>Kvartfinalen mot England starter om {countdownText}.</GlobalAlert.Content>
        </GlobalAlert>
    );
};

export default InternVmAlertStripe;
