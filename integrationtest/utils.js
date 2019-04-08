const getXPathWithIndex = (selector, index) => {
    return `(${selector})[${index + 1}]`;
};

module.exports = {
    getXPathWithIndex
};
