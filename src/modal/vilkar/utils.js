export function mapStatusTilStreng(status) {
    switch (status) {
        case 'IKKE_GODKJENT':
            return 'ikke godkjent';
        case 'GODKJENT':
            return 'godkjent';
        default:
            return 'ikke besvart';
    }
}
