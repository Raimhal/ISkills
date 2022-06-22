import React from 'react';
import '../../styles/App.css'
import {CSSTransition, TransitionGroup} from "react-transition-group";
import CommentItem from "./CommentItem";

const CommentList = ({comments, title, remove, update, userId, isAdmin}) => {
    return (
        <div className="comments">
            <h3 style={{padding: "5px"}}>{title}</h3>
            {comments?.length === 0
                ? <div>No comments found</div>
                : <TransitionGroup className="courses">
                    {comments.map(comment =>
                        <CSSTransition
                            key={comment.id}
                            timeout={500}
                            classNames="course"
                        >
                            <CommentItem comment={comment} remove={remove} update={update} userId={userId} isAdmin={isAdmin}/>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            }
        </div>
    );
};

export default CommentList;