export const getXPathWithIndex = (selector, index) => {
    return `(${selector})[${index + 1}]`;
};
