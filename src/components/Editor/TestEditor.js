import React from "react";
import Editor from "./Editor";

export default class TestEditor extends React.Component {
  onChange = (value) => {
    this.props.handleEditorChange("test", value, this.props.id);
  };

  editorDidMount = (editor, monaco) => {
    editor.addAction({
      id: "save-test",
      label: "Save Test",
      keybindings: [
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
      ],
      contextMenuGroupId: "file",
      contextMenuOrder: 1.5,
      run: () => {
        this.props.saveFile("test", this.props.value, this.props.id);
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
          language="text"
          onChange={this.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}
