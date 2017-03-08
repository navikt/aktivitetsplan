import React, { Component } from 'react';
import { FluidColumns, Panel, Tittel } from './../src/index';

function Example({ component, children, ...props }) {
    const propsCode = Object.entries(props)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(' ');
    const code = `<${component.name} ${propsCode} />`;
    return (
        <div className="example blokk-m">
            <pre>{code}</pre>
            {React.createElement(component, props, children)}
        </div>
    );
}

function Examples() {
    return (
        <div>
            <Tittel.Sidetittel className="sidetittel">Examples</Tittel.Sidetittel>
            <div className="container">
                <Tittel.Innholdstittel className="sidetittel">Fluidcolumns</Tittel.Innholdstittel>
                <Example component={FluidColumns}>
                    <Panel.Rammepanel><h1>Panel1</h1></Panel.Rammepanel>
                    <Panel.Rammepanel><h1>Panel2</h1></Panel.Rammepanel>
                    <Panel.Rammepanel><h1>Panel3</h1></Panel.Rammepanel>
                </Example>

                <Example component={FluidColumns} stretch={false}>
                    <Panel.Rammepanel><h1>Panel1</h1></Panel.Rammepanel>
                    <Panel.Rammepanel><h1>Panel2</h1></Panel.Rammepanel>
                    <Panel.Rammepanel><h1>Panel3</h1></Panel.Rammepanel>
                </Example>

                <Example component={FluidColumns} cols-sm="2" cols-md="3" cols-lg="4">
                    <Panel.Rammepanel><h1>Panel1</h1></Panel.Rammepanel>
                    <Panel.Rammepanel><h1>Panel2</h1></Panel.Rammepanel>
                    <Panel.Rammepanel><h1>Panel3</h1></Panel.Rammepanel>
                    <Panel.Rammepanel><h1>Panel4</h1></Panel.Rammepanel>
                </Example>

                <Example component={FluidColumns} center>
                    <Panel.Rammepanel><h1>Panel1</h1></Panel.Rammepanel>
                </Example>
            </div>
        </div>
    );
}

export default Examples;
