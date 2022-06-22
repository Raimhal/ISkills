import React from 'react';
import ChapterItem from "./ChapterItem";
import '../../styles/App.css'
import {CSSTransition, TransitionGroup} from "react-transition-group";

const ChapterList = ({chapters, title, remove, update, userId, isAdmin, updateVideo, removeVideo}) => {
    return (
        <div>
            <h3 style={{padding: "5px"}}>{title}</h3>
            {chapters?.length === 0
                ? <div>No chapters found</div>
                : <TransitionGroup className="chapters">
                    {chapters.map(chapter =>
                        <CSSTransition
                            key={chapter.id}
                            timeout={500}
                            classNames="chapter"
                        >
                            <ChapterItem
                                chapter={chapter}
                                remove={remove}
                                update={update}
                                userId={userId}
                                isAdmin={isAdmin}
                                updateVideo={updateVideo}
                                removeVideo={removeVideo}
                            />
                        </CSSTransition>
                    )}
                </TransitionGroup>
            }
        </div>
    );
};

export default ChapterList;