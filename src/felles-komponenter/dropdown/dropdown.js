import '../../styles/dropdown.css';

import classNames from 'classnames';
import PT from 'prop-types';
import React, { Children, Component, cloneElement } from 'react';

const btnCls = (erApen, className) =>
    classNames('dropdown', className, {
        'dropdown--apen': erApen,
    });

function isChildOf(parent, element) {
    if (element === document) {
        // eslint-disable-line no-undef
        return false;
    }

    if (element === parent) {
        return true;
    }
    return isChildOf(parent, element.parentNode);
}

function settFokus(element) {
    if (element !== null) {
        const elementer = element.querySelector('button, a, input, select');
        if (elementer) {
            elementer.focus();
        }
    }
}

class Dropdown extends Component {
    constructor(props) {
        super(props);
        const { apen } = this.props;
        this.state = { apen };

        this.eventHandler = this.eventHandler.bind(this);
        this.apneDropdown = this.apneDropdown.bind(this);
        this.lukkDropdown = this.lukkDropdown.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.bindComponent = this.bindComponent.bind(this);
        this.bindBtn = this.bindBtn.bind(this);
    }

    eventHandler(e) {
        if (e.code === 'Escape' || !isChildOf(this.component, e.target)) {
            this.lukkDropdown();
        }
    }

    apneDropdown() {
        const { onOpen } = this.props;
        document.body.addEventListener('click', this.eventHandler); // eslint-disable-line no-undef
        document.body.addEventListener('keyup', this.eventHandler); // eslint-disable-line no-undef
        this.setState({ apen: true });
        onOpen();
    }

    lukkDropdown() {
        const { onLukk } = this.props;
        document.body.removeEventListener('click', this.eventHandler); // eslint-disable-line no-undef
        document.body.removeEventListener('keyup', this.eventHandler); // eslint-disable-line no-undef
        this.setState({ apen: false });
        this.btn.focus();
        onLukk();
    }

    toggleDropdown() {
        const { apen } = this.state;
        if (apen) {
            this.lukkDropdown();
        } else {
            this.apneDropdown();
        }
    }

    bindComponent(component) {
        this.component = component;
    }

    bindBtn(btn) {
        this.btn = btn;
    }

    render() {
        const { name, className, children, knappeTekst } = this.props;
        const { apen } = this.state;

        const augmentedChild = Children.map(children, (child) => {
            if (typeof child.type === 'string') {
                return child;
            }
            return cloneElement(child, { closeDropdown: this.lukkDropdown });
        });
        const innhold = (
            <div
                hidden={!apen}
                className={`${name}-dropdown__innhold dropdown__innhold`}
                id={`${name}-dropdown__innhold`}
                ref={settFokus}
            >
                {augmentedChild}
            </div>
        );

        return (
            <div className={btnCls(apen, className)} ref={this.bindComponent}>
                <div className="dropdown__btnwrapper">
                    <button
                        ref={this.bindBtn}
                        type="button"
                        className="dropdown__btn"
                        onClick={this.toggleDropdown}
                        aria-expanded={apen}
                        aria-controls={`${name}-dropdown__innhold`}
                    >
                        {knappeTekst}
                    </button>
                </div>
                {innhold}
            </div>
        );
    }
}

Dropdown.propTypes = {
    apen: PT.bool,
    name: PT.string.isRequired,
    knappeTekst: PT.string.isRequired,
    children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]).isRequired,
    className: PT.string,
    onLukk: PT.func,
    onOpen: PT.func,
};
Dropdown.defaultProps = {
    apen: false,
    className: null,
    onLukk: () => {},
    onOpen: () => {},
};

export default Dropdown;
