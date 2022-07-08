import React, {useState} from 'react';
import ReactPlayer from 'react-player'
import Loading from "../UI/Loading/Loading";
import InnerLoading from "../UI/Loading/InnerLoading";
import { Player } from 'video-react';


const MyPlayer = ({video, ...props}) => {

    const [loading, setLoading] = useState(true)
    return (
        <div className="flex-row">
            <ReactPlayer
                url={video.url}
                controls={true}
                controlsList="nodownload"
                playsinline={true}
                pip={true}
                width="60vw"
                height="35vw"
                poster={video.title}
                onBuffer={() => setLoading(true)}
                onReady={() => setLoading(false)}
                onStart={() => setLoading(false)}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1 }
                    },
                }}
            />
            {loading && <Loading/>}
        </div>
    );
};

export default MyPlayer;