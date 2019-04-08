const aktivitetsplanOversiktSide = browser => {
    return browser.page.aktivitetsplanOversiktSide();
};
const aktivitetModal = browser => {
    return browser.page.aktivitetModal();
};
const aktivitetsvisningModal = browser => {
    return browser.page.aktivitetsvisningModal();
};
const dialogOversiktModal = browser => {
    return browser.page.dialogOversiktModal();
};

module.exports = {
    aktivitetsplanOversiktSide,
    aktivitetModal,
    aktivitetsvisningModal,
    dialogOversiktModal
};
