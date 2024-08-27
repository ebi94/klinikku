// ** React Imports
import { useEffect, useState } from 'react';
import { stateToHTML } from 'draft-js-export-html';

// import htmlToDraft from 'html-to-draftjs';

// ** Third Party Imports
import { EditorState, ContentState, convertFromHTML } from 'draft-js';

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg';

const EditorControlled = (props) => {
  const { onChange, clearState, defaultValues } = props;

  const [value, setValue] = useState(EditorState.createEmpty());

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const clearEditorState = () => {
    // const newEditorState = EditorState.push(editorState, ContentState.createFromText(''));
    setValue(EditorState.createEmpty());
  };

  useEffect(() => {
    if (defaultValues) {
      const defaultState = EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(defaultValues))
      );
      setValue(defaultState);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (clearState) clearEditorState();
  }, [clearState]);

  useEffect(() => {
    if (value !== undefined) {
      let options = {
        defaultBlockTag: 'div'
      };
      let htmlContent = stateToHTML(value.getCurrentContent(), options);
      onChange(htmlContent);
    }
  }, [value]);

  return <ReactDraftWysiwyg editorState={value} onEditorStateChange={(data) => setValue(data)} />;
};

export default EditorControlled;
