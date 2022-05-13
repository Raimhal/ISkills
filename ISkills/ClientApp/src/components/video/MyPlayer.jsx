import React, {useEffect} from 'react';
import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'


const MyPlayer = ({video, ...props}) => {
    let player;
    useEffect(() => {
        player = new MuiPlayer({
            container: `#v${video.id}`,
            src: video.url,
            title: video.title,
            preload: "auto",
            showMiniProgress: true,
            fitContent: true,
            controls: true,
        })
    })
    return (
        <div id={`v${video.id}`} {...props} >

        </div>
    );
};

export default MyPlayer;