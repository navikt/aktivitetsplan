export const getParentPathByChildText = (
    browser,
    tekst,
    parentSelector,
    childSelectorPostFix,
    timeout,
    cb
) => {
    let success = false;

    getIndexedXPaths(browser, parentSelector, timeout, callback => {
        if (callback.length === 0) {
            cb({
                errorText: 'Fant ingen elementer på path:' + parentSelector,
                success: false,
            });
        } else {
            for (let i = 0; i < callback.length; i++) {
                browser
                    .getText(callback[i] + childSelectorPostFix, actualText => {
                        if (actualText.value === tekst) {
                            cb({ value: callback[i], success: true });
                            success = true;
                        }
                    })
                    .perform(() => {
                        if (i === callback.length - 1 && !success)
                            cb({
                                success: false,
                                errorText:
                                    'Fant ingen elementer med tekst:' + tekst,
                            });
                    });
            }
        }
    });
};

//Henter ut xpather med indeksering
export const getIndexedXPaths = (browser, selector, timeout, callback) => {
    browser.elements('xpath', selector, element => {
        let items = [];
        if (element.value.length === 0)
            browser.assert.fail(
                'Could not find any list elements for selector: ' + selector
            );
        for (let i = 0; i < element.value.length; i++) {
            const parentXpath = getXPathWithIndex(selector, i);
            items.push(parentXpath);
        }
        callback(items);
    });
};

export const getXPathWithIndex = (selector, index) => {
    return `(${selector})[${index + 1}]`;
};
