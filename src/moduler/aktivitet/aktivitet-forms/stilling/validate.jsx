
export function validateTittel(avtalt, value) {
    if (avtalt) {
        return;
    }
    if (!value || value.trim().length <= 0) {
        return 'Du må fylle ut stillingstittel';
    }
    if (value.length > 100) {
        return `Du må korte ned teksten til 100 tegn`;
    }
}
