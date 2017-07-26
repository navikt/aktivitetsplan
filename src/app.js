import 'babel-polyfill';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SideBanner from './moduler/sidebanner/sidebanner';
import Provider from './provider';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import Feature from './felles-komponenter/feature/feature';
import './index.less';
import Routing from './routing';
import Hovedside from './sider/hovedside/hovedside';
import routerHistory from './history';
import { getFodselsnummer } from './bootstrap/fnr-util';
import { VIS_SIDEBANNER, CONTEXT_PATH, FNR_I_URL } from '~config'; // eslint-disable-line

function App() {
    const basename = FNR_I_URL
        ? `${CONTEXT_PATH}/${getFodselsnummer()}`
        : CONTEXT_PATH;

    return (
        <div className="aktivitetsplanfs">
            <Provider>
                <SideBanner visible={VIS_SIDEBANNER} />
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <BrowserRouter
                            basename={basename}
                            history={routerHistory}
                        >
                            <Hovedside>
                                {Routing}
                            </Hovedside>
                        </BrowserRouter>
                        <Feature name="timeoutbox">
                            <Timeoutbox />
                        </Feature>
                    </div>
                </div>
            </Provider>
        </div>
    );
}

export default App;
