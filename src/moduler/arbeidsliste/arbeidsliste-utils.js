// eslint-disable-next-line import/prefer-default-export
export const lagArbeidsliste = (fnr, form, props) => ({
    fnr,
    veilederId: props.veileder,
    kommentar: form.kommentar,
    frist: form.frist,
});
