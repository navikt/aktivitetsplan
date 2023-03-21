const regex = `\\d{11}`;

export const hentFnrFraUrl = (): string | undefined => {
    const url = window.location.pathname;
    const match = url.match(regex);

    if (match && match.length === 1) {
        return match[0];
    }

    return undefined;
};
