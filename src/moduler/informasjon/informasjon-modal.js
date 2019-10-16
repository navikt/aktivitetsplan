import React, { Component } from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import PT from 'prop-types';
import Modal from '../../felles-komponenter/modal/modal';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import Video from './video';
import { selectLestInformasjon } from '../lest/lest-reducer';
import * as Api from '../lest/lest-api';
import { selectErBruker } from '../identitet/identitet-selector';
import * as AppPT from '../../proptypes';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { selectBackPath, setBackPath } from './informasjon-reducer';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Tekstomrade from 'nav-frontend-tekstomrade';
import styles from './informasjon-modal.module.less';
import Lenke from 'nav-frontend-lenker';
export const INFORMASJON_MODAL_VERSJON = 'v1';

class InformasjonModal extends Component {
    componentWillMount() {
        const { erBruker, underOppfolging, lestInfo } = this.props;

        if (erBruker && underOppfolging && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON)) {
            Api.lesInformasjon(INFORMASJON_MODAL_VERSJON);
        }
    }

    render() {
        const { resetBackPath, backPath, history } = this.props;

        return (
            <Modal
                contentLabel="informasjon-modal"
                contentClass="informasjon-visning"
                onRequestClose={() => {
                    resetBackPath();
                    history.push(backPath);
                }}
            >
                <ModalContainer className="informasjon-modal-container">
                    <Innholdstittel className={styles.innholdsTittel}>Hva er aktivitetsplanen?</Innholdstittel>
                    <Tekstomrade className="mellomrom">
                        {`Aktivitetsplanen din er verktøyet du skal bruke for å komme i aktivitet og jobb. Denne blir delt med veilederen din. For at vi skal kunne følge deg opp best mulig, er det viktig at du bruker aktivitetsplanen aktivt. Du må gjennomføre de aktivitetene du avtaler med NAV i planen.
                        
                        Du kan selv legge inn og redigere målet ditt, aktiviteter du skal gjøre og stillinger du vil søke på. Du får også tilgang til en dialog der du kan kommunisere med veilederen din og diskutere aktiviteter du skal gjennomføre.`}
                    </Tekstomrade>
                    <Video />
                    <Ekspanderbartpanel tittel="Slik bruker du planen">
                        <p>
                            Det første du bør gjøre er å bestemme deg for hva som er målet ditt. Tenk over hvilke jobber
                            du kan trives i og som du tror passer for deg. Når du har definert et mål, kan du vurdere
                            hvilke aktiviteter som må til for at du skal nå dette målet. Eksempler på aktiviteter kan
                            være å søke jobber, kortere kurs og arbeidstrening. Aktivitetsplanen skal hjelpe deg med å
                            strukturere og holde oversikt over aktivitetene dine.
                        </p>
                        <p>
                            Aktivitetsplanen er delt inn i fem kolonner med statusene forslag, planlegger, gjennomfører,
                            fullført og avbrutt. Du flytter en aktivitet fra en kolonne til en annen ved å dra og slippe
                            aktiviteten, eller ved å velge status inne i aktiviteten. På denne måten viser du
                            fremdriften i aktivitetene du skal gjennomføre.
                        </p>
                        <p>
                            Du kan selv legge inn aktiviteter i planen. NAV kan også foreslå aktiviteter for deg som du
                            selv velger om du vil gjennomføre. I tillegg kan veilederen din legge til aktiviteter som du
                            er forpliktet til å gjennomføre. Disse aktivitetene vil ha en blå etikett som heter «Avtalt
                            med NAV». Du kan ikke gjøre endringer i slike aktiviteter. Hvis du er uenig i at en
                            aktivitet er merket som avtalt, kan du skrive i dialogen og forklare hvorfor du er uenig.
                        </p>
                        <p>
                            Noen ganger vil aktivitetene være merket med en blå prikk. Det betyr at veilederen din har
                            gjort en endring.
                        </p>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Aktivitetsplanen og økonomisk støtte">
                        <p>
                            Aktivitetsplanen og dialogen skal kun handle om jobbrettede aktiviteter. Du skal derfor ikke
                            skrive om økonomisk støtte, økonomisk sosialhjelp, boligsituasjon eller andre ting som ikke
                            handler om jobb.
                        </p>
                        <p>
                            <ul>
                                <li>
                                    Bruk nav.no til å finne svar på disse spørsmålene. Hvis du ikke finner svaret der,
                                    kan du ringe oss på 55 55 33 33.
                                </li>
                                <li>
                                    Hvis du ikke følger opp avtalte aktiviteter, kan det få konsekvenser for
                                    oppfølgingen du får fra NAV og eventuell økonomisk støtte.
                                </li>
                            </ul>
                        </p>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Meldekort">
                        <p>
                            Hvis du får dagpenger, tiltakspenger eller er arbeidssøker, skal du oppgi tiltak, kurs eller
                            utdanning på meldekortet. Aktivitetsplanen din kan inneholde flere avtalte aktiviteter enn
                            det meldekortet spør deg om. Det kan for eksempel gjelde jobber du skal søke på eller
                            oppdatering av CV-en din.
                        </p>
                        <p>
                            Hvis du får arbeidsavklaringspenger, skal du føre opp alle aktiviteter du har gjort på
                            meldekortet.
                        </p>
                        <p>
                            Her kan du lese{' '}
                            <Lenke href="https://www.nav.no/no/Person/Arbeid/Dagpenger+ved+arbeidsloshet+og+permittering/Meldekort+hvordan+gjor+du+det">
                                mer informasjon om meldekort
                            </Lenke>
                            .
                        </p>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Rettigheter og personvern">
                        <p>
                            Når du henvender deg til NAV fordi du trenger hjelp til å komme i jobb, skal NAV vurdere
                            behovet ditt for hjelp.
                        </p>
                        <p>
                            Du har rett til å få en aktivitetsplan. Alle som ikke har reservert seg fra digital
                            kommunikasjon med det offentlige, skal bruke aktivitetsplanen og kommunisere med NAV gjennom
                            den. Du kan få manuell oppfølging hvis det er gode grunner til det. Manuell oppfølging betyr
                            at en veileder følger deg opp uten at du har en digital aktivitetsplan. Veilederen vil legge
                            inn aktiviteter, møtereferat og fylle inn målet ditt i aktivitetsplanen for deg. Du får da
                            aktivitetsplanen i papirform.
                        </p>
                        <p>
                            Opplysningene i aktivitetsplanen, slik som aktiviteter, målet ditt og dialogen mellom deg og
                            veilederen din, er det du og NAV som legger inn. Formålet med disse opplysningene er å
                            hjelpe deg å komme raskt i jobb. Opplysningene dine blir ikke delt med andre instanser eller
                            etater, med mindre de har lovlig grunnlag til å samle inn slike opplysninger.
                        </p>
                        <p>
                            NAV henter også informasjon fra Folkeregisteret for å gjøre en sjekk mot Kontakt- og
                            reservasjonsregisteret. Dette gjør vi for å se om du har reservert deg mot digital
                            kommunikasjon med det offentlige.{' '}
                        </p>
                        <p>
                            Opplysningene i aktivitetsplanen din blir lagret og oppbevart etter arkivloven. Aktiviteter
                            og meldinger i dialogen kan ikke slettes når de først er opprettet.
                        </p>
                        <p>
                            Les mer om{' '}
                            <Lenke href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten">
                                hvordan NAV behandler personopplysninger
                            </Lenke>
                            .
                        </p>
                    </Ekspanderbartpanel>
                </ModalContainer>
            </Modal>
        );
    }
}

InformasjonModal.defaultProps = {
    lestInfo: null,
    backPath: '/'
};

InformasjonModal.propTypes = {
    erBruker: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    lestInfo: AppPT.lest,
    resetBackPath: PT.func.isRequired,
    backPath: PT.string,
    history: AppPT.history.isRequired
};

const mapStateToProps = state => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
    underOppfolging: selectErUnderOppfolging(state),
    backPath: selectBackPath(state)
});

const mapDispatchToProps = dispatch => ({
    resetBackPath: () => dispatch(setBackPath('/'))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InformasjonModal);
