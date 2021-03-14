import "./Debugger.css";
import React from "react";
import { Icon, Badge, Whisper, Tooltip } from "rsuite";

export default class Debugger extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="debugger-titlebar">
          <div className="left">
            {this.props.unseen ? (
              <Badge>
                <span>
                  <Icon onClick={this.props.toggle} icon="terminal" /> Output
                  Console
                </span>
              </Badge>
            ) : (
              <span>
                <Icon onClick={this.props.toggle} icon="terminal" /> Output
                Console
              </span>
            )}
          </div>
          <div className="right">
            <Whisper
              placement="top"
              trigger="hover"
              speaker={<Tooltip>Clear Console</Tooltip>}
            >
              <Icon onClick={this.props.clearOutput} icon="trash" />
            </Whisper>
            <Whisper
              placement="top"
              trigger="hover"
              speaker={
                <Tooltip>
                  {this.props.expanded ? "Minimize" : "Maximize"} Console
                </Tooltip>
              }
            >
              <Icon
                onClick={this.props.toggle}
                icon={this.props.expanded ? "angle-down" : "angle-up"}
              />
            </Whisper>
          </div>
        </div>
        <div
          style={{
            height: this.props.height,
            overflowY: "auto",
            overflowWrap: "break-word",
          }}
          className="content"
        >
          {this.props.content.map((data) => {
            return data.map((line, i) => (
              <span key={i}>
                <code>{line}</code>
                <br />
              </span>
            ));
          })}
        </div>
      </div>
    );
  }
}
