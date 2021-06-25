const httpRegex = /^(https?):\/\/.*$/;

export const formatterLenke = (lenke: string) => {
    const nyLenke = lenke?.trim();
    return nyLenke && nyLenke.match(httpRegex) ? nyLenke : `http://${lenke}`;
};
