import "./WelcomePage.css";
import EditorImage from "./image/editor_light.png";
import EditorImageDark from "./image/editor.png";
import BackgroundImage from "./image/bg.png";
import React from "react";
import { Button, Tooltip, Whisper } from "rsuite";
import IPCService from "../service/IPCService";
import UtilityService from "../service/UtilityService";

const npmId = UtilityService.V4();

export default class WelcomePage extends React.Component {
  componentDidMount() {
    UtilityService.WaitForProject(npmId);

    IPCService.send("ready");
  }

  openLink(link) {
    IPCService.send("open-link", link);
  }

  openProject() {
    IPCService.send("request-open-project");
  }

  createProject() {
    IPCService.send("request-create-project", {
      process: { npm: { id: npmId } },
    });
  }

  render() {
    return (
      <div
        style={{ backgroundImage: `url(${BackgroundImage})` }}
        className="welcome-wrapper"
      >
        <div className="welcome">
          <div>
            <h1 className="message">
              Welcome to <br /> Sinope.
            </h1>
            <ul className="features">
              <li>
                Sinope is an editor tool and a testing environment for{" "}
                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={<Tooltip>https://nearley.js.org</Tooltip>}
                >
                  <span
                    onClick={() => this.openLink("https://nearley.js.org")}
                    className="link"
                  >
                    nearley.js
                  </span>
                </Whisper>
                , a <b>JavaScript</b> parser generator toolkit.
              </li>
              <li>
                Write your grammar and tests and see the results live. See
                syntax errors in both your grammar and your tests with extended
                language support.
              </li>
              <li>
                Export your grammar to <b>JavaScript</b>, <b>TypeScript</b> or
                even <b>Executable</b> files.
              </li>
              <li>
                Add your packages from npm with built-in minimal package
                manager. (Comes with{" "}
                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={<Tooltip>https://www.npmjs.com/package/moo</Tooltip>}
                >
                  <span
                    onClick={() =>
                      this.openLink("https://www.npmjs.com/package/moo")
                    }
                    className="link"
                  >
                    moo tokenizer
                  </span>
                </Whisper>{" "}
                pre-installed)
              </li>
            </ul>
            <div className="cta">
              <Button
                onClick={this.createProject}
                appearance="primary"
                size="lg"
              >
                Create Project
              </Button>
              <Button onClick={this.openProject} appearance="default" size="lg">
                Open Project
              </Button>
            </div>
          </div>
        </div>
        <div className="editor">
          <img alt="Sinope Editor Dark" src={EditorImageDark} />
          <img alt="Sinope Editor" src={EditorImage} />
        </div>
      </div>
    );
  }
}
