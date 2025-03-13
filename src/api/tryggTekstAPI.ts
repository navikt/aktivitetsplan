import { Dispatch, SetStateAction } from 'react';

type UseSensitive = (
    verdi: string | null | undefined,
    feilmelding?: string,
) => [string | undefined, Dispatch<SetStateAction<string | undefined>>, () => boolean];

export type LLMResponse = {
    content: string;
};

export type LLMStreamChunk = {
    content: string;
    done: boolean;
};

interface LLMContent {
    grunn: string;
    kategori: string;
}

interface IsSensitive {
    kategori: string;
    sensitiv: boolean;
    feilmedling: string | null;
}

const baseUrl = 'http://34.34.85.30:8007';
const wsUrl = 'ws://34.34.85.30:8007';

// WebSocket connection for streaming responses
class LlamaCppWebSocket {
    private ws: WebSocket | null = null;
    private messageCallback: ((chunk: LLMStreamChunk) => void) | null = null;
    private errorCallback: ((error: Error) => void) | null = null;
    private completeCallback: (() => void) | null = null;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 3;

    constructor() {
        this.connect();
    }

    private connect() {
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(wsUrl + '/ws');
        
        this.ws.onopen = () => {
            console.log('WebSocket connection established');
            this.isConnected = true;
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (this.messageCallback) {
                    const isDone = data.done || false;
                    this.messageCallback({
                        content: data.content || '',
                        done: isDone
                    });
                    
                    if (isDone && this.completeCallback) {
                        this.completeCallback();
                    }
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                if (this.errorCallback) {
                    this.errorCallback(new Error('Failed to parse WebSocket message'));
                }
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (this.errorCallback) {
                this.errorCallback(new Error('WebSocket connection error'));
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            this.isConnected = false;
            
            // Attempt to reconnect
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
            } else {
                console.error('Max reconnect attempts reached');
                if (this.errorCallback) {
                    this.errorCallback(new Error('Failed to establish WebSocket connection after multiple attempts'));
                }
            }
        };
    }

    public send(data: any): Promise<LLMResponse> {
        return new Promise((resolve, reject) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                reject(new Error('WebSocket is not connected'));
                return;
            }

            let fullResponse = '';

            this.messageCallback = (chunk) => {
                fullResponse += chunk.content;
            };

            this.errorCallback = (error) => {
                reject(error);
            };

            this.completeCallback = () => {
                resolve({ content: fullResponse });
            };

            this.ws.send(JSON.stringify(data));
        });
    }

    public stream(data: any, onChunk: (chunk: LLMStreamChunk) => void, onError: (error: Error) => void, onComplete: () => void): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            onError(new Error('WebSocket is not connected'));
            return;
        }

        this.messageCallback = onChunk;
        this.errorCallback = onError;
        this.completeCallback = onComplete;

        this.ws.send(JSON.stringify(data));
    }

    public close(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Singleton instance of WebSocket connection
const wsConnection = new LlamaCppWebSocket();

async function postRequest(inp: string): Promise<LLMResponse> {
    const data = {
        stream: true, // Enable streaming
        n_predict: 2048,
        temperature: 0,
        dry_allowed_length: 10,
        dry_base: 3,
        dry_multiplier: 5,
        dry_penalty_last_n: 50,
        stop: ['</s>', 'user:', 'assistant:'],
        penalize_nl: false,
        repeat_last_n: 256,
        repeat_penalty: 1,
        top_k: 1,
        top_p: 1,
        min_p: 0,
        tfs_z: 1,
        min_keep: 0,
        typical_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        mirostat: 0,
        mirostat_tau: 5,
        mirostat_eta: 0.1,
        grammar:
            'root ::= "{" space kategori-kv space "}" space nl\n' +
            '\n' +
            'kategori-kv ::= "\\"kategorier\\"" space ":" space "[" space kategori-list space "]" space\n' +
            '\n' +
            'kategori-list ::= kategori-multiple\n' +
            '\n' +
            'kategori-ingen ::= "\\"ingen\\"" space\n' +
            '\n' +
            'kategori-multiple ::= kategori-obj ("," space kategori-obj)*\n' +
            '\n' +
            'kategori-obj ::= "{" space "\\"kategori\\"" space ":" space kategori-gyldig space "," space "\\"grunn\\"" space ":" space json-string space "}" space\n' +
            '\n' +
            'kategori-gyldig ::= ("\\"etnisk opprinnelse\\""\n' +
            '                     | "\\"politisk oppfatning\\""\n' +
            '                     | "\\"religion\\""\n' +
            '                     | "\\"filosofisk overbevisning\\""\n' +
            '                     | "\\"fagforeningsmedlemskap\\""\n' +
            '                     | "\\"genetiske opplysninger\\""\n' +
            '                     | "\\"biometriske opplysninger\\""\n' +
            '                     | "\\"helseopplysninger\\""\n' +
            '                     | "\\"seksuelle forhold\\""\n' +
            '                     | "\\"seksuell legning\\"") space\n' +
            '\n' +
            'json-string ::= "\\"" str-characters "\\"" space\n' +
            'str-characters ::= | str-character str-characters\n' +
            'str-character ::= [^"\\\\] | "\\\\" escape\n' +
            'escape ::= ["\\\\/bfnrt] | "u" hex hex hex hex\n' +
            '\n' +
            'hex ::= [0-9A-Fa-f]\n' +
            '\n' +
            'space ::= | " " {0,1}\n' +
            'nl ::= | "\\n" [ \\t]{0,1}\n',
        n_probs: 9,
        image_data: [],
        cache_prompt: false,
        api_key: '',
        slot_id: 0,
        prompt: `<|start_header_id|>system<|end_header_id|>\\n\\nDu er en klassifiseringsbot. Du skal vurdere om teksten inneholder særlige kategorier av personopplysninger, og hvis ja hvilke opplysningstype som best beskriver innholdet i teksten. Velg blant følgende 11 kategorier av opplysninger:
* politisk oppfatning
* religion
* etnisk opprinnelse
* filosofisk overbevisning
* fagforeningsmedlemskap
* genetiske opplysninger
* biometriske opplysninger
* helseopplysninger
* seksuelle forhold
* seksuell legning
* ingen særlige kategorier av personopplysninger
kan innholde flere kategorier eller ingen. Returnere med kategori og settningen som triggret kategorien uten å endre den eller sammenfatte den.<|start_header_id|>user<|end_header_id|>
${inp}\\n<|eot_id|>assistant`,
    };

    try {
        // Use WebSocket for streaming
        return await wsConnection.send(data);
    } catch (error) {
        console.error('WebSocket error:', error);
        
        // Fallback to HTTP if WebSocket fails
        return await fetch(`/tryggtekst/proxy`, {
            method: 'POST',
            body: JSON.stringify({ ...data, stream: false }), // Disable streaming for HTTP fallback
            headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch((e) => {
                console.log(e);
                return e;
            });
    }
}

// Stream version that provides chunks as they arrive
export const streamSjekkForPersonopplysninger = (
    verdi: string,
    onChunk: (chunk: string) => void,
    onComplete: (result: IsSensitive) => void,
    onError: (error: Error) => void
) => {
    if (!verdi) {
        onComplete({ kategori: '', sensitiv: false, feilmedling: null });
        return;
    }

    const data = {
        stream: true,
        // ... same parameters as in postRequest
        n_predict: 2048,
        temperature: 0,
        // ... other parameters omitted for brevity
        prompt: `<|start_header_id|>system<|end_header_id|>\\n\\nDu er en klassifiseringsbot. Du skal vurdere om teksten inneholder særlige kategorier av personopplysninger, og hvis ja hvilke opplysningstype som best beskriver innholdet i teksten. Velg blant følgende 11 kategorier av opplysninger:
* politisk oppfatning
* religion
* etnisk opprinnelse
* filosofisk overbevisning
* fagforeningsmedlemskap
* genetiske opplysninger
* biometriske opplysninger
* helseopplysninger
* seksuelle forhold
* seksuell legning
* ingen særlige kategorier av personopplysninger
kan innholde flere kategorier eller ingen. Returnere med kategori og settningen som triggret kategorien uten å endre den eller sammenfatte den.<|start_header_id|>user<|end_header_id|>
${verdi}\\n<|eot_id|>assistant`,
    };

    let fullResponse = '';

    wsConnection.stream(
        data,
        (chunk) => {
            fullResponse += chunk.content;
            onChunk(chunk.content);
        },
        onError,
        () => {
            try {
                const containsSensitive = JSON.parse(fullResponse);
                let feil = '';
                let sensitiv = false;
                let kategori = '';

                if (containsSensitive.kategorier && containsSensitive.kategorier.length > 0) {
                    kategori = containsSensitive.kategorier.map((item: LLMContent) => item.kategori).join(', ');
                    feil = `⚠️ Det ser ut som du har skrevet inn personopplysninger om ${kategori} i skjemaet.`;
                    sensitiv = true;
                } else {
                    feil = '👌✅';
                    sensitiv = false;
                }

                onComplete({ kategori, sensitiv, feilmedling: feil });
            } catch (error) {
                onError(new Error('Failed to parse response'));
            }
        }
    );
};

const postSjekkForPersonopplysninger = async (verdi: string) => {
    let feil = '';
    let sensitiv = false;
    let kategorier: { kategori: string; grunn: string }[] = [];
    console.log('useSensitive', verdi);

    if (!verdi) {
        console.log('ingen verdi', verdi);
        return { kategorier: [], sensitiv: sensitiv, feilmedling: feil };
    } else {
        console.log('verdi som ska til llm', verdi);
        const b = await postRequest(verdi).then(async (c: LLMResponse) => {
            const containsSensitive = JSON.parse(c.content);
            console.log('containsSensitive', containsSensitive);

            if (containsSensitive.kategorier && containsSensitive.kategorier.length > 0) {
                kategorier = containsSensitive.kategorier.map((item: LLMContent) => ({
                    kategori: item.kategori,
                    grunn: item.grunn,
                }));
                feil = `⚠️ Det ser ut som du har skrevet inn personopplysninger om ${kategorier.map((k) => k.kategori).join(', ')} i skjemaet.`;
                sensitiv = true;
            } else {
                feil = '👌✅';
                sensitiv = false;
            }
            return { kategorier: kategorier, sensitiv: sensitiv, feilmedling: feil };
        });
    }
    return { kategorier: kategorier, sensitiv: sensitiv, feilmedling: feil };
};

export default postSjekkForPersonopplysninger;
