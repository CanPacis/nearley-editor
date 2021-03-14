import React from "react";
import Editor from "./Editor";

export default class PipelineEditor extends React.Component {
  constructor(props) {
    super(props);

    this.default = `export default class Pipeline {
  constructor(parser, input) {
    parser.feed(input);
    this.result = parser.results;
  }
}
`;
  }

  onChange = (value) => {
    this.props.handleEditorChange("lexer", value);
  };

  editorDidMount = (editor, monaco) => {
    editor.addAction({
      id: "save-lexer",
      label: "Save Lexer",
      keybindings: [
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
      ],
      contextMenuGroupId: "file",
      contextMenuOrder: 1.5,
      run: () => {
        this.props.saveFile("lexer", this.props.value);
      },
    });
  };

  render() {
    return (
      <div className={`main-editor ${this.props.active ? "active" : ""}`}>
        <Editor
          editorDidMount={this.editorDidMount}
          language="js"
          onChange={this.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}
