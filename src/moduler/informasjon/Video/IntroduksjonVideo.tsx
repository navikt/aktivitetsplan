import React from 'react';
const IntroduksjonVideo = () => {
    return (
        <div className="color-black">
            <iframe
                title="Video: Aktivitetsplan - Introduksjon"
                src="https://video.qbrick.com/play2/embed/qbrick-player?accountId=763558&mediaId=fb0502e7-2ed9-4f27-a6d5-3a40a68975d2&configId=qbrick-player&pageStyling=adaptive&autoplay=false&repeat=false&sharing=true&download=false&volume&language=nb"
                allow="fullscreen"
                className="w-full h-300px mt-4 "
                id="introduksjonsvideo"
            />
        </div>
    );
};

export default IntroduksjonVideo;
