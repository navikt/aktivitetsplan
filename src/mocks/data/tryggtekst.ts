import { delay, HttpResponse } from 'msw';
import { LLMResponse, LLMStreamChunk } from '../../api/tryggTekstAPI';

const jsonContent = {
    kategorier: [
        {
            kategori: 'helseopplysninger',
            grunn: 'Du er i gang med behandling hos   fysioterapeut, men det er antatt at det vil ta noe tid å bli kvitt plagene. Trykkbølgebehandling og nåler prøves først.',
        },
        {
            kategori: 'religion',
            grunn: 'Du ...',
        },
    ],
};

const response = {
    data: {
        content: JSON.stringify(jsonContent),
    } as LLMResponse,
};

// HTTP response handler
export const sjekkTryggTekst = async () => {
    await delay(2000);
    return HttpResponse.json(response);
};

// Define types for WebSocket connection event
interface WebSocketConnectionEvent {
    client: {
        send: (data: string) => void;
        addEventListener: (event: string, listener: (event: MessageEvent) => void) => void;
    };
    server: unknown;
}

// WebSocket message handler for streaming
export const handleTryggTekstWebSocket = ({ client }: WebSocketConnectionEvent) => {
    // Simulate streaming chunks
    const streamChunks = [
        { content: '{"kategorier":', done: false },
        { content: ' [{"kategori":', done: false },
        { content: ' "helseopplysninger", "grunn":', done: false },
        { content: ' "Du er i gang med behandling hos   fysioterapeut, men det er antatt at det vil ta noe tid å bli kvitt plagene. Trykkbølgebehandling og nåler prøves først."}', done: false },
        { content: ', {"kategori": "religion", "grunn": "Du ..."}]}', done: true }
    ];

    // Send chunks with delays to simulate streaming
    let chunkIndex = 0;
    
    const sendNextChunk = () => {
        if (chunkIndex < streamChunks.length) {
            const chunk = streamChunks[chunkIndex];
            client.send(JSON.stringify(chunk));
            chunkIndex++;
            
            if (chunkIndex < streamChunks.length) {
                setTimeout(sendNextChunk, 300); // Send next chunk after 300ms
            }
        }
    };
    
    // Start sending chunks after a small delay
    setTimeout(sendNextChunk, 500);
    
    // Handle messages from client
    client.addEventListener('message', (event: MessageEvent) => {
        // Reset and start streaming again when receiving a new request
        chunkIndex = 0;
        setTimeout(sendNextChunk, 500);
    });
};
