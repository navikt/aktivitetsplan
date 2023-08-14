import { AKTIVITET_BASE_URL } from '../environment';
import { Features, toggles } from '../moduler/feature/feature';
import { fetchToJson } from './utils';

export function hentFeatures(): Promise<Features> {
    return fetchToJson(`${AKTIVITET_BASE_URL}/feature?${toggles}`);
}
