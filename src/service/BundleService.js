import IPCService from "./IPCService";

export default class BundleService {
  constructor(directory) {
    this.directory = directory;
  }

  listen = (callbacks) => {
    IPCService.on("notification", callbacks.notification);
    IPCService.on("stdout", callbacks.stdout);
    IPCService.on("provide-bundle", callbacks.handleBundleComplete);
    IPCService.on("provide-test-run", callbacks.handleTestRun);
    IPCService.on(
      "provide-read-dependencies",
      callbacks.provideReadDependencies
    );
    IPCService.on("provide-read-files", callbacks.provideReadFiles);
    IPCService.on("provide-read-gitlog", callbacks.provideReadGitlog);
    IPCService.on("compile-error", (data) =>
      this.handleCompileError(data, callbacks.handleCompileError)
    );
  };

  handleCompileError = (data, handleCompileError) => {
    let strip = data.content.split("\n");
    let [line, col] = strip[5]
      .split("line")[1]
      .trim()
      .split("col")
      .map((n) => parseInt(n.trim().split(":")[0]));

    let message = `${strip[7]}\n${strip[9].split(".")[0]}`;

    let error = {
      startLineNumber: line - 6,
      endLineNumber: line - 6,
      startColumn: col,
      endColumn: col + 1,
      message: message,
      severity: 8,
    };

    handleCompileError(error);
  };

  requestReadFiles() {
    IPCService.send("request-read-files", { path: this.directory });
  }

  requestReadDependencies() {
    IPCService.send("request-read-dependencies", { path: this.directory });
  }

  requestReadGitlog() {
    IPCService.send("request-read-gitlog", { path: this.directory });
  }

  requestCreateFile(type, name) {
    let extension;

    switch (type) {
      case "tests":
        extension = "txt";
        break;
      case "includes":
        extension = "ne";
        break;
      default:
        extension = "";
        break;
    }

    IPCService.send("request-create-file", {
      path: this.directory,
      extension,
      type,
      name,
    });
  }

  requestCompile(id) {
    IPCService.send("request-compile", {
      path: this.directory,
      process: { id },
    });
  }

  requestBundle(id) {
    IPCService.send("request-bundle", {
      process: { id },
      path: this.directory,
    });
  }

  requestTestRun(id, name) {
    IPCService.send("request-test-run", {
      process: { id },
      path: this.directory,
      name,
    });
  }

  requestSaveFile(type, content, name) {
    IPCService.send("request-save-file", {
      type,
      content,
      name,
      path: this.directory,
    });
  }

  requestNpmInstall(pack, dev, id) {
    IPCService.send("request-npm-install", {
      path: this.directory,
      process: { id },
      pack,
      dev,
    });
  }

  requestRunGit(data, id) {
    IPCService.send("request-git-command", {
      path: this.directory,
      process: { id },
      ...data,
    });
  }
}
