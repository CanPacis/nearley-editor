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

  build(parser) {
    // let input = fs.readFileSync(process.argv[2]).toString()
    // parser.feed(input)
    // return parser.results[0]
  }
}
`;
  }

  onChange = (value) => {
    this.props.handleEditorChange("pipeline", value);
  };

  editorDidMount = (editor, monaco) => {
    editor.addAction({
      id: "save-pipeline",
      label: "Save Pipeline",
      keybindings: [
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
      ],
      contextMenuGroupId: "file",
      contextMenuOrder: 1.5,
      run: () => {
        this.props.saveFile("pipeline", this.props.value);
      },
    });

    editor.addAction({
      id: "restore-pipeline",
      label: "Restore Pipeline to Default",
      keybindings: [
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_T),
      ],
      contextMenuGroupId: "file",
      contextMenuOrder: 1.5,
      run: () => {
        this.props.handleEditorChange("pipeline", this.default);
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
