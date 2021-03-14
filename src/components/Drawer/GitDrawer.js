import "./Drawer.css";
import React from "react";
import { Sidenav, Timeline, Icon, Button, Modal, Input } from "rsuite";

export default class GitDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayModal: false,
      promptValue: "",
    };
  }

  closeModal = (type) => {
    if (type === "add") {
      if (this.state.promptValue.trim() !== "") {
        console.log(this.state.promptValue);
        this.props.runGit({ type: "commit", subject: this.state.promptValue });
      }
    }

    this.setState({ displayModal: false });
  };

  openModal = () => {
    let state = this.state;

    state.displayModal = true;
    this.setState(state, () => {
      setTimeout(() => {
        document.querySelector(".modal-body input").focus();
      }, 0);
    });
  };

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            padding: this.props.expanded ? "20px" : "0",
          }}
        >
          <Sidenav onSelect={this.handleSelect} expanded={this.props.expanded}>
            <Sidenav.Body>
              {!this.props.expanded && (
                <div className="run">
                  <Button onClick={this.props.expand} appearance="ghost" block>
                    <Icon icon={this.props.expanded ? "compress" : "expand"} />
                  </Button>
                </div>
              )}
              {this.props.expanded ? (
                <Timeline className="custom-timeline">
                  {this.props.gitlog.map((log) => (
                    <Timeline.Item
                      dot={<Icon icon="github" size="2x" />}
                      key={log.hash}
                    >
                      <span className="meta">
                        {Intl.DateTimeFormat("default", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(log.authorDate))}
                      </span>
                      <br />
                      <span className="meta">[{log.authorName}]</span>
                      <br />
                      <p>{log.subject}</p>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                "E"
              )}
            </Sidenav.Body>
          </Sidenav>
        </div>

        <div className="run">
          <Button onClick={this.openModal} appearance="ghost" block>
            <Icon icon="code-fork" />
            {this.props.expanded && <span>Commit</span>}
          </Button>
          <Button
            onClick={this.props.reinstallPackages}
            appearance="primary"
            block
          >
            <Icon icon="upload2" />
            {this.props.expanded && <span>Push</span>}
          </Button>
        </div>
        <Modal
          backdrop={false}
          show={this.state.displayModal}
          onHide={this.closeModal}
        >
          <Modal.Header>
            <Modal.Title>What is the Subject?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body">
              <span>Give your commit a subject.</span>
              <Input
                onChange={(value) => this.setState({ promptValue: value })}
                placeholder="Subject"
              />
              {/* <Checkbox
                onChange={(_, checked) => this.setState({ dev: checked })}
                value={this.state.dev}
              >
                {" "}
                Add this package as a development dependency.
              </Checkbox> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={() => this.closeModal("add")} appearance="primary">
              Commit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
