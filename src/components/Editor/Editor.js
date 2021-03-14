import React from "react";
// import Theme from "./Editor.dark.theme.json";
import NearleyLanguage from "./Nearley.lang";
import JavaScriptLanguage from "./JavaScript.lang";
import MonacoEditor, { monaco } from "react-monaco-editor";
import UtilityService from "../../service/UtilityService";

if (window.theme === "dark") {
  import("./Editor.dark.theme.json").then((Theme) => {
    monaco.editor.defineTheme("custom-theme", Theme.default);
    monaco.editor.setTheme("custom-theme");
  });
} else {
  import("./Editor.dark.theme.json").then((Theme) => {
    monaco.editor.defineTheme("custom-theme", Theme.default);
    monaco.editor.setTheme("custom-theme");
  });
}

function createTooltip(data) {
  let result = "";

  data.forEach((l) => {
    l.tokens.forEach((token) => {
      if (token.literal) {
        result += `*"${token.literal}"* | `;
      } else if (token.subexpression) {
        result += "(";
        result += createTooltip(token.subexpression).trim();
        result += ") | ";
      } else {
        result += `**${token}** | `;
      }
    });

    result = result.substring(0, result.length - 2) + " | ";
  });

  result = result.substring(0, result.length - 2);

  if (data[0].postprocess) {
    let postprocess =
      data[0].postprocess.trim() === "id" ? "(d) => d[0]" : data[0].postprocess;
    result += "\n```javascript\n" + postprocess + "\n```";
  }

  return result;
}

monaco.languages.register({ id: "nearley-lang" });
monaco.languages.setMonarchTokensProvider("nearley-lang", NearleyLanguage);

monaco.languages.register({ id: "js" });
monaco.languages.setMonarchTokensProvider("js", JavaScriptLanguage);

monaco.languages.setLanguageConfiguration("nearley-lang", {
  autoClosingPairs: [
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: "{", close: "}" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "%", close: "%" },
  ],
});

monaco.languages.registerCompletionItemProvider("nearley-lang", {
  provideCompletionItems: (model, position) => {
    var word = model.getWordUntilPosition(position);
    var range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    return {
      suggestions: [
        {
          label: "postprocessor",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Add JavaScript Postprocessor",
          insertText: "{% d => ${1:js} %}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        },
        {
          label: "id",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Return 'id' postprocessor",
          insertText: "{% id %}",
          range: range,
        },
      ],
    };
  },
});

monaco.languages.registerHoverProvider("nearley-lang", {
  provideHover: function (model, position) {
    let cursor = model.getWordAtPosition(position);
    let parsed = UtilityService.ParseGrammar(model.getValue());

    if (cursor) {
      let rule;
      parsed.forEach((line) => {
        if (line.name === cursor.word) {
          rule = line;
        }
      });

      if (rule) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            position.column - 1,
            position.lineNumber,
            cursor.endColumn
          ),
          contents: [
            { value: `**Rule '${rule.name}'**` },
            // { value: model.getLineContent(position.lineNumber) },
            { value: createTooltip(rule.rules) },
          ],
        };
      }
    }

    return null;
  },
});

export default class EditorComponent extends React.Component {
  constructor() {
    super();
  }

  editorDidMount = (editor, monaco) => {
    if (this.props.editorDidMount) {
      this.props.editorDidMount(editor, monaco);
    }
    if (!this.props.readOnly) {
      editor.focus();
    }
  };

  onChange = (newValue, e) => {
    this.props.onChange(newValue, e);
  };

  render() {
    const options = {
      automaticLayout: true,
      wordWrap: "on",
      tabSize: 2,
      lineNumbers: this.props.lineNumbers || "on",
      readOnly: this.props.readOnly || false,
    };

    return (
      <span style={{ width: "100%", height: "100vh", display: "block" }}>
        <MonacoEditor
          language={this.props.language}
          theme="custom-theme"
          value={this.props.value || ""}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
      </span>
    );
  }
}
