// got this from https://stackoverflow.com/a/42543908
function isScrollParent(parent, excludeStaticParent, overflowRegex) {
    const parentStyle = getComputedStyle(parent);
    if (excludeStaticParent && parentStyle.position === 'static') {
        return false;
    }
    if (overflowRegex.test(parentStyle.overflow + parentStyle.overflowY + parentStyle.overflowX)) {
        return true;
    }

    return false;
}

export default function getScrollParent(element, includeHidden) {
    const style = getComputedStyle(element);
    const excludeStaticParent = style.position === 'absolute';
    const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    if (style.position === 'fixed') {
        return document.body;
    }

    let parent = element.parentElement;

    while (!!parent && !isScrollParent(parent, excludeStaticParent, overflowRegex)) {
        parent = parent.parentElement;
    }
    return !parent ? document.body : parent;
}
