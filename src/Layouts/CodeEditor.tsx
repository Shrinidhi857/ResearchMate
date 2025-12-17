// src/components/CodeEditor.tsx

import React from "react";
import AceEditor from "react-ace";

// Import required Ace Editor components and styles
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-chrome"; // A popular light theme
import "ace-builds/src-noconflict/ext-language_tools"; // For autocompletion

// Define the component's props interface
interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  minHeight: string;
  className?: string;
}

/**
 * A wrapper component for the Ace Editor configured for LaTeX syntax highlighting.
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  minHeight,
  className = "",
}) => {
  return (
    <div
      className={`ace-editor-container ${className}`}
      // This is a container for the Ace Editor, helping manage layout
      style={{ minHeight: minHeight, width: "100%" }}
    >
      <AceEditor
        mode="latex" // Use LaTeX mode for syntax highlighting
        theme="chrome" // Set the editor theme
        onChange={onChange}
        value={value}
        name="latex_code_editor"
        fontSize={14}
        showPrintMargin={false} // Hide the print margin line
        showGutter={true} // Show line numbers
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height={minHeight} // Set height to fill the container
        className="ace-editor-override"
        style={{ minHeight: minHeight }}
      />
    </div>
  );
};

export default CodeEditor;
