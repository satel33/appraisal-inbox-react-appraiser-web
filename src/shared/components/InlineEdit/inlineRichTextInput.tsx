import React, { useEffect } from 'react';

function InlineRichText(props: any) {
  useEffect(() => {
    setTimeout(() => {
      const toolbar = document.querySelector('.ql-toolbar') as any;
      const editor = document.querySelector('.ql-editor') as any;
      const container = document.querySelector('.ql-container') as any;
      const helperText = document.querySelector('#notes-section .MuiFormHelperText-root') as any;
      if (helperText) {
        helperText.style.display = 'none';
      }
      if (toolbar && container) {
        container.append(toolbar);
        container.style.border = 'none';
      }
      if (toolbar && editor && props.edit === false) {
        toolbar.style.display = 'none';
        toolbar.style.marginLeft = '10px';
        editor.style.border = '1px solid rgba(0, 0, 0, 0.12)';
        editor.style.borderRadius = '3px';
        editor.style.borderLeft = 'none';
        editor.style.borderRight = 'none';
        editor.style.borderBottom = 'none';
        editor.style.padding = '10px 10px';
        editor.setAttribute('contenteditable', false);

        if (props.hideBorder) {
          editor.style.border = 'none';
        }
      }
    }, 10);
  }, []);

  const onClick = () => {
    const toolbar = document.querySelector('.ql-toolbar') as any;
    const editor = document.querySelector('.ql-editor') as any;
    if (toolbar && editor) {
      toolbar.style.display = 'block';
      editor.style.padding = '10px 10px';
    }
  };

  const hideToolbar = () => {
    const toolbar = document.querySelector('.ql-toolbar') as any;
    const editor = document.querySelector('.ql-editor') as any;
    if (toolbar && editor) {
      toolbar.style.display = 'none';
      editor.setAttribute('contenteditable', false);
    }
  };

  useEffect(() => {
    if (props.edit) {
      onClick();
      const editor = document.querySelector('.ql-editor') as any;
      if (editor) {
        editor.setAttribute('contenteditable', true);
      }
    } else {
      hideToolbar();
    }
  }, [props.edit]);

  return <div id="notes-section">{props.input}</div>;
}

export default InlineRichText;
