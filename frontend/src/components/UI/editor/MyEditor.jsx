import React, {useState} from 'react';
import {convertToRaw, EditorState, ContentState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs"
import classes from './MyEditor.module.css'

const MyEditor = ({defaultValue = '', onChange = null, readonly = false,  ...props}) => {

    const blocksFromHTML = htmlToDraft(defaultValue);
    const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    );

    const [editorState, setEditorState] = useState(
        () => EditorState.createWithContent(state)
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
                readOnly={readonly}
                toolbarClassName={readonly && classes.toolbar__none}
            />
        </div>
    );
};

export default MyEditor;