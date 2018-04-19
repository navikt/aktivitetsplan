import React, { Component, PropTypes as PT } from 'react';
import { Input } from 'nav-frontend-skjema';

function limit(liste, antall) {
    return liste.slice(0, antall);
}

class SokFilter extends Component {
    constructor(props) {
        super(props);
        this.state = { query: '' };
        this.changeQuery = this.changeQuery.bind(this);
    }

    changeQuery(e) {
        this.setState({ query: e.target.value });
    }

    render() {
        const { data, filter, children, ...props } = this.props;
        const filteredData = limit(data.filter(filter(this.state.query)), 20);
        return (
            <div>
                <div className="sokfilter">
                    <Input
                        label={this.props.label}
                        placeholder={this.props.placeholder}
                        value={this.state.query}
                        onChange={this.changeQuery}
                    />
                </div>
                {children(filteredData, props)}
            </div>
        );
    }
}

SokFilter.propTypes = {
    data: PT.arrayOf(PT.object).isRequired,
    filter: PT.func.isRequired,
    children: PT.func.isRequired,
    label: PT.string.isRequired,
    placeholder: PT.string.isRequired,
};

SokFilter.defaultProps = {
    filter: query => dataEntry =>
        !query ||
        JSON.stringify(dataEntry).toLowerCase().includes(query.toLowerCase()),
};

export default SokFilter;
