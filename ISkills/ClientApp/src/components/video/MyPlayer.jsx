import React, {useEffect} from 'react';
import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
import ReactPlayer from 'react-player'


const MyPlayer = ({video, ...props}) => {
    return (
        <ReactPlayer
            url={video.url}
            controls={true}
            controlsList="nodownload"
            playsinline={true}
            pip={true}
            width="60vw"
            height="auto"
            poster={video.title}
        />
    );
};

export default MyPlayer;