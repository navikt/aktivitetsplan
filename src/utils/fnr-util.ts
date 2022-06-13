const regex = `\\d{11}`;
// eslint-disable-next-line import/prefer-default-export
export const hentFnrFraUrl = (): string | undefined => {
    const url = window.location.pathname;
    const match = url.match(regex);

    if (match && match.length === 1) {
        return match[0];
    }

    return undefined;
};
