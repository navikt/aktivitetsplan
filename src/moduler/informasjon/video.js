import React, { Component } from 'react';
import { autobind } from '../../utils';
import Accordion from '../../felles-komponenter/accordion';

const ONBOARDING_VIDEO_URL =
    'https://video.qbrick.com/play2/embed/player?accountId=763558&mediaId=74420478-00015227-993dea3a&configId=default&pageStyling=adaptive&autoplay=true&repeat=true&sharing=true';

class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false
        };
        autobind(this);
    }

    onClick() {
        const { apen } = this.state;
        this.setState({
            apen: !apen
        });
    }

    render() {
        const { apen } = this.state;

        const accordionLabelId = apen ? 'informasjon.videokontent.skjul.tekst' : 'informasjon.videokontent.vis.tekst';

        return (
            <div>
                <iframe
                    title="onboarding-video"
                    frameBorder="0"
                    scrolling="no"
                    src={ONBOARDING_VIDEO_URL}
                    className="video-player"
                />
                <Accordion className="videotekst-accordion" labelId={accordionLabelId} onClick={this.onClick}>
                    <ul>
                        <li>
                            For at du skal holde oversikt og vite hva som forventes av deg, og kunne samarbeide med
                            veilederen din, har vi laget en aktivitetsplan på nav.no
                        </li>
                        <li>
                            Aktivitetsplan er et verktøy du kan bruke for å komme deg ut i jobb, enten det er fort gjort
                            eller om det kreves litt mer langsiktig planlegging.
                        </li>
                        <li>Du setter deg mål, lager planer og legger inn oppgaver du skal gjennomføre.</li>
                        <li>
                            Dette gjør du enkelt på små kort som du kan dra og slippe, avhengig av hva du har gjort så
                            langt.
                        </li>
                        <li>
                            Og det fine er, at du kan dele alt med veilederen din så dere sammen kan diskutere det neste
                            steget ditt.
                        </li>
                        <li>Du og veilederen din samarbeider om aktivitetsplanen når dere møtes, og hver for dere.</li>
                        <li>Dere kan diskutere kortene og du får varsling når du har fått svar.</li>
                        <li>Målet er at du skal få en jobb på den måten som passer best for deg og din situasjon.</li>
                        <li>Lykke til!</li>
                    </ul>
                </Accordion>
            </div>
        );
    }
}

export default Video;
