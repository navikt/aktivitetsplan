import React from 'react';
const Video = () => {
    return (
        <div>
            <iframe title="Video: Aktivitetsplanen"
                    src="https://video.qbrick.com/play2/embed/qbrick-player?accountId=763558&amp;mediaId=ddf118c6-00015227-86825a7e&amp;configId=qbrick-player&amp;pageStyling=adaptive&amp;autoplay=false&amp;repeat=false&amp;sharing=false&amp;download=false&amp;volume"
                    allow="fullscreen"
                    className="pt-8 w-full h-300px" />
        </div>
    );
};

export default Video;
