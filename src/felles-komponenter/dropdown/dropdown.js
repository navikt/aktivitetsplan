import React, {
    Children,
    cloneElement,
    Component,
    PropTypes as PT,
} from 'react';
import classNames from 'classnames';

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

        this.state = { apen: this.props.apen };

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.lukkDropdown = this.lukkDropdown.bind(this);
        this.bindComponent = this.bindComponent.bind(this);
        this.handler = e => {
            if (!isChildOf(this.component, e.target)) {
                this.toggleDropdown();
            } else if (e.code === 'Escape') {
                this.toggleDropdown();
                this.btn.focus();
            }
        };
    }

    toggleDropdown() {
        const { onLukk } = this.props;
        if (this.state.apen) {
            document.body.removeEventListener('click', this.handler); // eslint-disable-line no-undef
            document.body.removeEventListener('keyup', this.handler); // eslint-disable-line no-undef
            onLukk();
        } else {
            document.body.addEventListener('click', this.handler); // eslint-disable-line no-undef
            document.body.addEventListener('keyup', this.handler); // eslint-disable-line no-undef
        }
        this.setState({ apen: !this.state.apen });
    }

    lukkDropdown() {
        const { onLukk } = this.props;
        this.setState({ apen: false });
        onLukk();
    }

    bindComponent(component) {
        this.component = component;
    }

    render() {
        const { name, className, children, knappeTekst } = this.props;
        const { apen } = this.state;

        const augmentedChild = Children.map(children, child =>
            cloneElement(child, {
                closeDropdown: this.toggleDropdown,
            })
        );
        const innhold = !apen
            ? null
            : <div
                  className={`${name}-dropdown__innhold dropdown__innhold`}
                  id={`${name}-dropdown__innhold`}
                  ref={settFokus}
              >
                  {augmentedChild}
              </div>;

        return (
            <div className={btnCls(apen, className)} ref={this.bindComponent}>
                <div className="dropdown__btnwrapper">
                    <button
                        ref={btn => {
                            this.btn = btn;
                        }}
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
};
Dropdown.defaultProps = {
    apen: false,
    className: null,
    onLukk: () => {},
};

export default Dropdown;
