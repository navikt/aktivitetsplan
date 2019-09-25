import React, { Component } from 'react';
import { autobind } from '../../utils';
import Accordion from '../../felles-komponenter/accordion';
import HtmlText from '../../htmlText';

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
                    <HtmlText className="mellomrom" id="informasjon.videokontent.text" />
                </Accordion>
            </div>
        );
    }
}

export default Video;
