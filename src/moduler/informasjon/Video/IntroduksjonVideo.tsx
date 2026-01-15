'use client'

import React, { useRef, useEffect } from 'react'
import { logKlikkKnapp } from '../../../analytics/analytics';

declare global {
    interface Window {
        GoBrain?: any
    }
}

const IntroduksjonVideo = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    // Når komponent mountes, laster vi GoBrain-script
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://play2.qbrick.com/qbrick-player/framework/GoBrain.min.js'
        script.async = true
        document.body.appendChild(script)

        return () => {
            // Cleanup hvis widget eksisterer
            if (window.GoBrain) {
                window.GoBrain.destroy('hardcoded-widget', true)
            }
        }
    }, [])

    const startVideo = () => {
        if (!window.GoBrain || !containerRef.current) return

        console.log("klikket video")
        logKlikkKnapp("klikket video")

        window.GoBrain.create(containerRef.current, {
            config: `//video.qbrick.com/play2/api/v1/accounts/763558/configurations/qbrick-player`,
            data: `//video.qbrick.com/api/v1/public/accounts/763558/medias/fb0502e7-2ed9-4f27-a6d5-3a40a68975d2`,
            autoplay: true, // starter video med en gang
            widgetId: 'hardcoded-widget',
            ignoreAnalytics: true,
        })
    }

    return (
        <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
            {/* Klikk på container starter video */}
            <div
                ref={containerRef}
                onClick={startVideo}
                style={{
                    width: '100%',
                    height: '450px',
                    backgroundColor: '#000',
                    borderRadius: 8,
                    cursor: 'pointer',
                }}
            >
                {/* Minimal overlay med play-symbol */}
                <span
                    style={{
                        color: 'white',
                        fontSize: 48,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    ▶
                </span>
            </div>
        </div>
    )
}

export default IntroduksjonVideo
