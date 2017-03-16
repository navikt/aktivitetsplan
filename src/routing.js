import "babel-polyfill";
import React from "react";
import {Router, Route, IndexRoute, applyRouterMiddleware} from "react-router";
import {useScroll} from "react-router-scroll";
import {indexRoute} from "~config";
import ModalHeader from "./felles-komponenter/modal-header";
import Hovedside from "./sider/hovedside";
import NyAktivitet from "./sider/modal/ny-aktivitet";
import EgenAktivitet from "./sider/modal/egen-aktivitet";
import StillingAktivitet from "./sider/modal/stilling-aktivitet";
import Aktivitetvisning from "./sider/modal/aktivitetvisning";
import EndreAktivitet from "./sider/modal/endre-aktivitet";

const VisVilkar = () => <ModalHeader visVilkar/>;

export default (
    <Route>
        <IndexRoute component={Hovedside}/>
        <Route path="vilkar" component={Hovedside}>
            <IndexRoute component={VisVilkar}/>
        </Route>
        <Route path="aktiviter" component={Hovedside}>
            <Route modalId="modal1" path="ny" component={NyAktivitet}/>
            <Route modalId="modal2" path="ny/egen" component={EgenAktivitet}/>
            <Route modalId="modal4" path="ny/stilling" component={StillingAktivitet}/>
            <Route modalId="modal5" path="aktivitet/:id" component={Aktivitetvisning}/>
            <Route modalId="modal6" path="aktivitet/:id/endre" component={EndreAktivitet}/>
        </Route>
        <Route path="*" component={Hovedside}/>
    </Route>
);
