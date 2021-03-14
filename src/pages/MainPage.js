import "./MainPage.css";

// 3rd Party Packaages
import React from "react";
import { Notification } from "rsuite";
import { Resize, ResizeHorizon, ResizeVertical } from "react-resize-layout";
// Components
import Toolbar from "../components/Toolbar/Toolbar";
import Debugger from "../components/Debugger/Debugger";
import Editor from "../components/Editor/Editor";
import GrammarEditor from "../components/Editor/GrammarEditor";
import TestEditor from "../components/Editor/TestEditor";
import IncludeEditor from "../components/Editor/IncludeEditor";
import PipelineEditor from "../components/Editor/PipelineEditor";
import LexerEditor from "../components/Editor/LexerEditor";
import EditorDrawer from "../components/Drawer/EditorDrawer";
import NotificationDrawer from "../components/Drawer/NotificationDrawer";
import PackagesDrawer from "../components/Drawer/PackagesDrawer";
import GitDrawer from "../components/Drawer/GitDrawer";
// Services
import BundleService from "../service/BundleService";
import UtilityService from "../service/UtilityService";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);

    let entry = {
      id: `grammar-${UtilityService.V4()}`,
      label: "Grammar",
      type: "grammar",
      value: "",
      editor: null,
      monaco: null,
    };

    let pipeline = {
      id: `pipeline-${UtilityService.V4()}`,
      label: "Pipeline",
      type: "pipeline",
      editor: null,
      monaco: null,
      value: "",
    };

    let lexer = {
      id: `lexer-${UtilityService.V4()}`,
      label: "Lexer",
      type: "lexer",
      editor: null,
      monaco: null,
      value: "",
    };

    this.state = {
      activeKey: "explorer",
      needsBundle: false,
      needsCompile: false,
      notifications: [],
      processes: [],
      gitlog: [],
      packages: {
        main: [],
        dev: [],
      },
      pipeline: pipeline,
      grammar: entry,
      lexer: lexer,
      directory: null,
      name: null,
      selectedFile: entry,
      result: [],
      debugger: {
        content: [],
        unseen: false,
        expanded: false,
        height: 300 - 26,
      },
      drawer: {
        expanded: true,
        entry,
        tests: [],
        includes: [],
      },
    };
  }

  componentDidMount() {
    let state = this.state;
    let directory = window.history.state.directory;
    let name = window.history.state.name;

    state.directory = directory;
    state.name = name;
    if (directory !== "browser") {
      state.processes = [...window.history.state.processes, ...state.processes];
      this.setState(state);

      this.bundleService = new BundleService(directory);
      this.bundleService.listen({
        notification: this.handleNotification,
        stdout: this.handleStdout,
        handleBundleComplete: this.handleBundleComplete,
        provideReadFiles: this.handleProvideReadFiles,
        provideReadDependencies: this.handleProvideReadDependencies,
        provideReadGitlog: this.handleProvideReadGitlog,
        handleCompileError: this.handleCompileError,
        handleTestRun: this.handleTestRun,
      });
      this.bundleService.requestReadFiles();
      this.bundleService.requestReadDependencies();
      this.bundleService.requestReadGitlog();
    }

    UtilityService.WaitForProject("remote");
  }

  handleNotification = (data) => {
    if (!data.silent) {
      Notification[data.type]({
        title: data.title,
        style: {
          minWidth: "250px",
        },
        description: <p>{data.message}</p>,
      });
    }

    let state = this.state;
    let stateIndex = state.processes.findIndex((p) => p.id === data.process);
    let historyIndex = window.history.state.processes.findIndex(
      (p) => p.id === data.process
    );

    if (stateIndex >= 0) {
      state.processes.splice(stateIndex, 1);
    }
    if (historyIndex >= 0) {
      let historyState = window.history.state;
      historyState.processes.splice(historyIndex, 1);
      window.history.pushState(historyState, "Editor", "/editor");
    }
    state.notifications.push(data);
    this.setState(state);
  };

  handleStdout = (data) => {
    let state = this.state;
    state.debugger.content.push(data.content.split("\n"));

    if (!state.debugger.expanded) {
      state.debugger.unseen = true;
    }
    this.setState(state);
  };

  handleCompileError = (data) => {
    this.setModelMarker("grammar", [data]);
  };

  handleProvideReadFiles = (data) => {
    let state = this.state;

    state.grammar.value = data.grammar;
    state.pipeline.value = data.pipeline;
    state.lexer.value = data.lexer;

    this.setState(state);

    data.tests.forEach((test) => {
      this.addFile("tests", test.name, test.content);
    });

    data.includes.forEach((test) => {
      this.addFile("includes", test.name, test.content);
    });
  };

  handleProvideReadDependencies = (data) => {
    let state = this.state;
    let main = data.main.map((pack) => ({ ...pack, id: UtilityService.V4() }));
    let dev = data.dev.map((pack) => ({ ...pack, id: UtilityService.V4() }));

    state.packages = { main, dev };
    this.setState();
  };

  handleProvideReadGitlog = (data) => {
    let state = this.state;
    state.gitlog = data.reverse();
    this.setState(state);
  };

  handleFileTabChange = (item) => {
    let type = item.split("-")[0];
    let selectedFile;

    switch (type) {
      case "grammar":
        selectedFile = this.state.drawer.entry;
        break;
      case "tests":
        let test = this.state.drawer.tests.find((test) => test.id === item);
        selectedFile = test;
        break;
      case "includes":
        let include = this.state.drawer.includes.find(
          (include) => include.id === item
        );
        selectedFile = include;
        break;
      case "pipeline":
        selectedFile = this.state.pipeline;
        break;
      case "lexer":
        selectedFile = this.state.lexer;
        break;
    }

    if (selectedFile) {
      this.setState({ selectedFile });
    }
  };

  handleCreateFile = (type, name) => {
    this.bundleService.requestCreateFile(type, name);
    this.addFile(type, name);
  };

  addFile = (type, name, value) => {
    let state = this.state;
    let file = {
      id: `${type}-${UtilityService.V4()}`,
      label: name,
      type: type,
      value: value || "",
    };
    state.drawer[type].push(file);
    if (value === undefined) {
      state.selectedFile = file;
    }
    this.setState(state);
  };

  runTest = () => {
    if (this.state.drawer.tests.length > 0) {
      let test = this.state.drawer.tests.find(
        (test) => test.id === this.state.selectedFile.id
      );

      if (this.state.needsCompile) {
        this.compileProject();
      }
      if (test) {
        this.bundleService.requestTestRun(0, test.label);
      } else {
        this.bundleService.requestTestRun(0, this.state.drawer.tests[0].label);
      }
    } else {
      Notification.warning({
        title: "Oops.",
        style: {
          minWidth: "250px",
        },
        description: <p>There are no tests! Go ahead and create one.</p>,
      });
    }
  };

  compileProject = () => {
    this.setModelMarker("grammar", []);

    if (this.state.needsBundle) {
      const id = UtilityService.V4();
      let state = this.state;
      state.processes = [
        { label: "Bundling lexer and pipeline", id },
        ...state.processes,
      ];
      state.needsCompile = false;
      this.setState(state);
      this.bundleService.requestBundle(id);
    } else {
      this.handleBundleComplete();
    }
  };

  npmInstall = (dev, pack) => {
    let state = this.state;
    let label;
    const id = UtilityService.V4();

    if (pack === undefined) {
      label = "Running npm install";
    } else {
      if (dev) {
        label = `Running npm install --save-dev ${pack}`;
      } else {
        label = `Running npm install --save ${pack}`;
      }
    }

    state.processes = [{ label, id }, ...state.processes];
    this.setState(state);
    this.bundleService.requestNpmInstall(pack, dev, id);
  };

  runGit = (data) => {
    let state = this.state;
    let label;
    const id = UtilityService.V4();

    label = `Running git ${data.type}`;

    state.processes = [{ label, id }, ...state.processes];
    this.setState(state);
    this.bundleService.requestRunGit(data, id);
  };

  handleBundleComplete = () => {
    const id = UtilityService.V4();
    let state = this.state;
    state.needsBundle = false;
    state.needsCompile = false;
    state.processes = [{ label: "Compiling Project", id }, ...state.processes];
    this.setState(state);
    this.bundleService.requestCompile(id);
  };

  handleTestRun = (data) => {
    this.setState({ result: JSON.parse(data.content) });
  };

  handleEditorChange = (type, value, id) => {
    let state = this.state;

    switch (type) {
      case "grammar":
        state.grammar.value = value;
        state.needsCompile = true;
        break;
      case "pipeline":
        state.pipeline.value = value;
        state.needsBundle = true;
        break;
      case "lexer":
        state.lexer.value = value;
        state.needsBundle = true;
        break;
      case "test":
        let test = this.state.drawer.tests.find((t) => t.id === id);
        test.value = value;
        break;
      case "include":
        let include = this.state.drawer.includes.find((i) => i.id === id);
        include.value = value;
        state.needsCompile = true;
        break;
    }

    this.setState(state);
  };

  setEditorData = (type, data, id) => {
    let state = this.state;

    switch (type) {
      case "grammar":
        state.grammar.editor = data.editor;
        state.grammar.monaco = data.monaco;
        break;
      case "pipeline":
        state.pipeline.editor = data.editor;
        state.pipeline.monaco = data.monaco;
        break;
      case "lexer":
        state.lexer.editor = data.editor;
        state.lexer.monaco = data.monaco;
        break;
      case "test":
        let test = this.state.drawer.tests.find((t) => t.id === id);
        test.editor = data.editor;
        test.monaco = data.monaco;
        break;
      case "include":
        let include = this.state.drawer.includes.find((i) => i.id === id);
        include.editor = data.editor;
        include.monaco = data.monaco;
        break;
    }

    this.setState(state);
  };

  saveFile = (type, value, id) => {
    let name;
    if (type === "test") {
      name = this.state.drawer.tests.find((t) => t.id === id).label;
    } else if (type === "include") {
      name = this.state.drawer.includes.find((i) => i.id === id).label;
    }
    this.bundleService.requestSaveFile(type, value, name);
  };

  closeModal = () => {
    this.setState({ displayModal: false });
  };

  expandDrawer = () => {
    let state = this.state;
    state.drawer.expanded = !state.drawer.expanded;
    this.setState(state);
  };

  toggleDebugger = () => {
    let state = this.state;
    state.debugger.expanded = !state.debugger.expanded;

    if (state.debugger.expanded) {
      state.debugger.unseen = false;
    }

    this.setState(state);
  };

  setModelMarker = (type, data, id) => {
    let monaco, editor;

    switch (type) {
      case "grammar":
        monaco = this.state.grammar.monaco;
        editor = this.state.grammar.editor;
        break;
      case "pipeline":
        monaco = this.state.pipeline.monaco;
        editor = this.state.pipeline.editor;
        break;
      case "lexer":
        monaco = this.state.lexer.monaco;
        editor = this.state.lexer.editor;
        break;
      case "test":
        let test = this.state.drawer.tests.find((t) => t.id === id);
        monaco = test.monaco;
        editor = test.editor;
        break;
      case "include":
        let include = this.state.drawer.includes.find((i) => i.id === id);
        monaco = include.monaco;
        editor = include.editor;
        break;
    }

    monaco.editor.setModelMarkers(editor.getModel(), "", data);
  };

  handleHorizontalResizeStop = (layout) => {
    let state = this.state;
    if (state.drawer.expanded) {
      if (layout.resizeChilds[0].width < 170) {
        state.drawer.expanded = false;
      }
    } else {
      if (layout.resizeChilds[0].width > 56) {
        state.drawer.expanded = true;
      }
    }
    this.setState(state);
  };

  handleVerticalResizeStop = (layout) => {
    let state = this.state;
    if (state.debugger.expanded) {
      if (layout.resizeChilds[1].height < 120) {
        state.debugger.expanded = false;
      }
    } else {
      if (layout.resizeChilds[1].height > 24) {
        state.debugger.expanded = true;
        state.debugger.unseen = false;
      }
    }
    state.debugger.height = layout.resizeChilds[1].height - 26;
    this.setState(state);
  };

  buildDrawer = () => {
    if (this.state.activeKey === "explorer") {
      return (
        <EditorDrawer
          trigger={this.state.drawer.trigger}
          addTest={(name) => this.handleCreateFile("tests", name)}
          addInclude={(name) => this.handleCreateFile("includes", name)}
          runTest={this.runTest}
          compile={this.compileProject}
          handleFileTabChange={this.handleFileTabChange}
          expand={this.expandDrawer}
          entry={this.state.drawer.entry}
          expanded={this.state.drawer.expanded}
          tests={this.state.drawer.tests}
          includes={this.state.drawer.includes}
        />
      );
    } else if (this.state.activeKey === "notifications") {
      return (
        <NotificationDrawer
          trigger={this.state.drawer.trigger}
          expand={this.expandDrawer}
          expanded={this.state.drawer.expanded}
          notifications={this.state.notifications}
        />
      );
    } else if (this.state.activeKey === "packages") {
      return (
        <PackagesDrawer
          trigger={this.state.drawer.trigger}
          expand={this.expandDrawer}
          expanded={this.state.drawer.expanded}
          packages={this.state.packages}
          installPackage={this.npmInstall}
          reinstallPackages={() => this.npmInstall(false)}
        />
      );
    } else if (this.state.activeKey === "git") {
      return (
        <GitDrawer
          gitlog={this.state.gitlog}
          trigger={this.state.drawer.trigger}
          expand={this.expandDrawer}
          expanded={this.state.drawer.expanded}
          runGit={this.runGit}
        />
      );
    }
  };

  render() {
    return (
      <span>
        <Toolbar
          breadcrumbs={[this.state.name, this.state.selectedFile.label]}
          processes={this.state.processes}
          activeKey={this.state.activeKey}
          handleToolbarSelect={(activeKey) => this.setState({ activeKey })}
        />
        <div className="main">
          <Resize
            onResizeStop={this.handleHorizontalResizeStop}
            handleWidth="3px"
            handleColor={window.theme === "dark" ? "#292D33" : "#dddddd"}
          >
            <ResizeHorizon
              width={this.state.drawer.expanded ? "15%" : "56px"}
              minWidth="56px"
            >
              {this.buildDrawer()}
            </ResizeHorizon>
            <ResizeHorizon
              className="margin-resize-horizon"
              width="60%"
              minWidth="600px"
            >
              <div className="nested-resize">
                <Resize
                  onResizeStop={this.handleVerticalResizeStop}
                  handleWidth="3px"
                  handleColor={window.theme === "dark" ? "#292D33" : "#dddddd"}
                >
                  <ResizeVertical
                    minHeight="200px"
                    height={this.state.debugger.expanded ? "60%" : "100%"}
                  >
                    <div className="main-editor-wrapper editor-wrapper">
                      <GrammarEditor
                        saveFile={this.saveFile}
                        compileProject={this.compileProject}
                        handleEditorChange={this.handleEditorChange}
                        active={this.state.selectedFile.type === "grammar"}
                        value={this.state.grammar.value}
                        setData={this.setEditorData}
                      />
                      <PipelineEditor
                        saveFile={this.saveFile}
                        handleEditorChange={this.handleEditorChange}
                        active={this.state.selectedFile.type === "pipeline"}
                        value={this.state.pipeline.value}
                      />
                      <LexerEditor
                        saveFile={this.saveFile}
                        handleEditorChange={this.handleEditorChange}
                        active={this.state.selectedFile.type === "lexer"}
                        value={this.state.lexer.value}
                      />
                      {this.state.drawer.tests.map((test) => (
                        <TestEditor
                          key={test.id}
                          id={test.id}
                          saveFile={this.saveFile}
                          compileProject={this.compileProject}
                          handleEditorChange={this.handleEditorChange}
                          active={this.state.selectedFile.id === test.id}
                          value={test.value}
                        />
                      ))}
                      {this.state.drawer.includes.map((include) => (
                        <IncludeEditor
                          key={include.id}
                          id={include.id}
                          saveFile={this.saveFile}
                          compileProject={this.compileProject}
                          handleEditorChange={this.handleEditorChange}
                          active={this.state.selectedFile.id === include.id}
                          value={include.value}
                        />
                      ))}
                    </div>
                  </ResizeVertical>
                  <ResizeVertical minHeight="26px">
                    <Debugger
                      unseen={this.state.debugger.unseen}
                      content={this.state.debugger.content}
                      toggle={this.toggleDebugger}
                      height={`${this.state.debugger.height}px`}
                      expanded={this.state.debugger.expanded}
                      clearOutput={() =>
                        this.setState({
                          debugger: {
                            ...this.state.debugger,
                            content: [],
                            unseen: false,
                          },
                        })
                      }
                    />
                  </ResizeVertical>
                </Resize>
              </div>
            </ResizeHorizon>
            <ResizeHorizon width="50%" minWidth="250px">
              <div className="editor-wrapper">
                <Editor
                  readOnly
                  onChange={() => {}}
                  value={JSON.stringify(this.state.result, null, 2)}
                  language="json"
                  lineNumbers="off"
                />
              </div>
            </ResizeHorizon>
          </Resize>
        </div>
      </span>
    );
  }
}
