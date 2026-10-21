import { afterEach, describe, expect, it, vi } from 'vitest';
import { postAsJson } from './utils';
import { fetchOppfolging } from './veilarboppfolging';
import { oppfolgingGraphql } from '../mocks/data/oppfolging';

const flate = vi.hoisted(() => ({ erIntern: false }));
vi.mock('../constant', () => ({
    get ER_INTERN_FLATE() {
        return flate.erIntern;
    },
}));
vi.mock('./utils', () => ({ postAsJson: vi.fn() }));

afterEach(() => {
    vi.clearAllMocks();
    flate.erIntern = false;
});

describe('fetchOppfolging', () => {
    it.each([false, true])('henter ekstern avslutningsstatus kun for bruker (intern=%s)', async (erIntern) => {
        flate.erIntern = erIntern;
        vi.mocked(postAsJson).mockResolvedValue({ data: oppfolgingGraphql });

        await fetchOppfolging(undefined);

        expect(postAsJson).toHaveBeenCalledWith(
            expect.stringContaining('/graphql'),
            {
                query: expect.stringMatching(
                    /oppfolging\(fnr: \$fnr\)\s*\{\s*erUnderOppfolging\s+kanAvslutteOppfolging @skip\(if: \$erVeileder\)\s*\}/,
                ),
                variables: { fnr: '', erVeileder: erIntern },
            },
            'fetchOppfolging',
        );
    });

    it.each([true, false, null, undefined])('beholder avslutningsstatus %s i responsen', async (verdi) => {
        const data = {
            ...oppfolgingGraphql,
            oppfolging: { ...oppfolgingGraphql.oppfolging, kanAvslutteOppfolging: verdi },
        };
        vi.mocked(postAsJson).mockResolvedValue({ data });

        expect(await fetchOppfolging(undefined)).toEqual(data);
    });

    it('avviser GraphQL-feil', async () => {
        vi.mocked(postAsJson).mockResolvedValue({ data: null, errors: [{ message: 'Feil' }] });
        await expect(fetchOppfolging(undefined)).rejects.toBeDefined();
    });
});
