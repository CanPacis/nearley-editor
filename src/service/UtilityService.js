import { Alert } from "rsuite";
import IPCService from "./IPCService";
import { Parser, Grammar } from "nearley";
import grammar from "./nearleyGrammar";

export default class UtilityService {
  static V4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  static WaitForProject(npmId) {
    IPCService.on("provide-open-project", ({ directory, name }) => {
      window.history.pushState(
        { directory, name, processes: [] },
        "Editor",
        "/editor"
      );
      window.location.replace("/editor");
    });
    IPCService.on("error-open-project", (data) => {
      Alert.error(data.message, 5000);
    });

    IPCService.on("provide-create-project", ({ directory, name }) => {
      window.history.pushState(
        {
          directory,
          name,
          processes: [
            { label: "Installing dependencies using npm", id: npmId },
          ],
        },
        "Editor",
        "/editor"
      );
      window.location.replace("/editor");
    });
    IPCService.on("error-create-project", (data) => {
      Alert.error(data.message, 5000);
    });
  }

  static ParseGrammar(value) {
    try {
      let parser = new Parser(Grammar.fromCompiled(grammar));
      parser.feed(value);
      return parser.results[0];
    } catch (error) {
      return [];
    }
  }
}
