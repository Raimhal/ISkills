import React, {useState} from 'react';
import {convertToRaw, EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import ReactHtmlParser from "react-html-parser";
import classes from './MyEditor.module.css'

const MyEditor = ({onChange, ...props}) => {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty()
    )

    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

    return (
        <div>
            <Editor
                {...props}
                editorState={editorState}
                onChange={() => onChange(content)}
                editorClassName={classes.editorContent}
                onEditorStateChange={setEditorState}
            />
            <div>{ReactHtmlParser(content)}</div>
        </div>
    );
};

export default MyEditor;