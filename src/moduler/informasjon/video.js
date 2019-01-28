import React, { Component } from 'react';
import { autobind } from '../../utils';
import { ONBOARDING_VIDEO_URL } from '../../environment';
import Accordion from '../../felles-komponenter/accordion';
import { HtmlText } from '../../text';

class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
        autobind(this);
    }

    onClick() {
        this.setState({
            apen: !this.state.apen,
        });
    }

    render() {
        const accordionLabelId = this.state.apen
            ? 'informasjon.videokontent.skjul.tekst'
            : 'informasjon.videokontent.vis.tekst';

        return (
            <div>
                <iframe
                    title="onboarding-video"
                    frameBorder="0"
                    scrolling="no"
                    src={ONBOARDING_VIDEO_URL}
                    className="video-player"
                />
                <Accordion
                    className="videotekst-accordion"
                    labelId={accordionLabelId}
                    onClick={this.onClick}
                >
                    <HtmlText
                        className="mellomrom"
                        id="informasjon.videokontent.text"
                    />
                </Accordion>
            </div>
        );
    }
}

export default Video;
