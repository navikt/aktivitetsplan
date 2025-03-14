import React, { useState, useEffect, useRef } from 'react';
import { streamSjekkForPersonopplysninger } from '../api/tryggTekstAPI';

interface TryggTekstStreamDemoProps {
    initialText?: string;
}

const TryggTekstStreamDemo: React.FC<TryggTekstStreamDemoProps> = ({ initialText = '' }) => {
    const [inputText, setInputText] = useState(initialText);
    const [streamingResult, setStreamingResult] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isSensitive, setIsSensitive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const streamingRef = useRef<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
    };

    const handleStreamingCheck = () => {
        if (!inputText.trim()) {
            setErrorMessage('Vennligst skriv inn tekst for å sjekke');
            return;
        }

        setIsStreaming(true);
        setStreamingResult('');
        setErrorMessage('');
        streamingRef.current = '';

        streamSjekkForPersonopplysninger(
            inputText,
            (chunk) => {
                // Handle each chunk as it arrives
                streamingRef.current += chunk;
                setStreamingResult(streamingRef.current);
            },
            (result) => {
                // Handle completion
                setIsStreaming(false);
                setIsSensitive(result.sensitiv);
            },
            (error) => {
                // Handle errors
                setIsStreaming(false);
                setErrorMessage(`Feil ved streaming: ${error.message}`);
            }
        );
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">TryggTekst Streaming Demo</h2>
            
            <div className="mb-4">
                <label htmlFor="inputText" className="block mb-2 font-medium">
                    Skriv inn tekst for å sjekke for personopplysninger:
                </label>
                <textarea
                    id="inputText"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={5}
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Skriv inn tekst her..."
                />
            </div>
            
            <button
                onClick={handleStreamingCheck}
                disabled={isStreaming}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isStreaming ? 'Sjekker...' : 'Sjekk med streaming'}
            </button>
            
            {errorMessage && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
                    {errorMessage}
                </div>
            )}
            
            {streamingResult && (
                <div className="mt-4">
                    <h3 className="font-medium mb-2">Resultat (streaming):</h3>
                    <div className={`p-3 rounded-md ${isSensitive ? 'bg-red-100' : 'bg-green-100'}`}>
                        <pre className="whitespace-pre-wrap">{streamingResult}</pre>
                    </div>
                </div>
            )}
            
            {isSensitive && (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-md">
                    ⚠️ Teksten inneholder personopplysninger som bør behandles forsiktig.
                </div>
            )}
        </div>
    );
};

export default TryggTekstStreamDemo; 