import React from "react";
import Editor from "./Editor";

export default class GrammarEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    this.props.handleEditorChange("grammar", value);
  };

  editorDidMount = (editor, monaco) => {
    this.props.setData("grammar", { editor, monaco });

    editor.addAction({
      id: "save-grammar",
      label: "Save Grammar",
      keybindings: [
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
      ],
      contextMenuGroupId: "file",
      contextMenuOrder: 1.5,
      run: () => {
        this.props.saveFile("grammar", this.props.value);
      },
    });

    editor.addAction({
      id: "compile-project",
      label: "Compile Project",
      keybindings: [
        monaco.KeyMod.chord(monaco.KeyMod.Alt | monaco.KeyCode.KEY_B),
      ],
      contextMenuGroupId: "file",
      contextMenuOrder: 2.0,
      run: () => {
        this.props.compileProject();
      },
    });
  };

  render() {
    return (
      <div className={`main-editor ${this.props.active ? "active" : ""}`}>
        <Editor
          editorDidMount={this.editorDidMount}
          language="nearley-lang"
          onChange={this.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}
