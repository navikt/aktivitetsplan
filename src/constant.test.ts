import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe('lenke til avslutt oppfølging i Inngar', () => {
    it.each([
        'https://start-arbeidsoppfolging.nav.no/avslutt-oppfolging',
        'https://start-arbeidsoppfolging.ekstern.dev.nav.no/avslutt-oppfolging',
    ])('bruker adressen fra miljøvariabelen: %s', async (url) => {
        vi.stubEnv('VITE_AVSLUTT_OPPFOLGING_URL', url);
        vi.resetModules();
        const { AVSLUTT_OPPFOLGING_URL } = await import('./constant');
        expect(AVSLUTT_OPPFOLGING_URL).toBe(url);
    });
});
