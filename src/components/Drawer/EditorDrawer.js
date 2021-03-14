import "./Drawer.css";
import React from "react";
import {
  Sidenav,
  Nav,
  Dropdown,
  Icon,
  Button,
  Modal,
  Input,
  InputPicker,
} from "rsuite";

export default class EditorDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.selectData = [
      {
        label: "Test",
        value: "Test",
        role: "Master",
      },
      {
        label: "Include",
        value: "Include",
        role: "Master",
      },
    ];

    this.state = {
      displayModal: false,
      fileType: this.selectData[0].value,
      promptValue: "",
    };
  }

  handleSelect = (item) => {
    this.props.handleFileTabChange(item);
  };

  closeModal = (type) => {
    if (type === "add") {
      if (this.state.promptValue.trim() !== "") {
        if (this.state.fileType === "Test") {
          this.props.addTest(this.state.promptValue);
        } else if (this.state.fileType === "Include") {
          this.props.addInclude(this.state.promptValue);
        }
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
        <div style={{ height: "90%", overflowY: "auto", overflowX: "hidden" }}>
          <Sidenav onSelect={this.handleSelect} expanded={this.props.expanded}>
            <Sidenav.Body>
              <div className="run">
                {!this.props.expanded && (
                  <Button onClick={this.props.expand} appearance="ghost" block>
                    <Icon icon={this.props.expanded ? "compress" : "expand"} />
                  </Button>
                )}
                <Button
                  onClick={() => this.openModal("include")}
                  appearance="primary"
                  block
                >
                  <Icon icon="plus-square" />
                  {this.props.expanded && <span>Add File</span>}
                </Button>
              </div>
              <Nav>
                <Nav.Item
                  eventKey={this.props.entry.id}
                  icon={<Icon icon="code" />}
                >
                  {this.props.entry.label}
                </Nav.Item>
                <Nav.Item eventKey="lexer-main" icon={<Icon icon="magic" />}>
                  Lexer
                </Nav.Item>
                <Nav.Item eventKey="pipeline-main" icon={<Icon icon="flow" />}>
                  Pipeline
                </Nav.Item>
                <Dropdown
                  eventKey="3"
                  title="Includes"
                  icon={<Icon icon="file" />}
                >
                  {this.props.includes.map((include) => (
                    <Dropdown.Item key={include.id} eventKey={include.id}>
                      {include.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
                <Dropdown
                  eventKey="2"
                  title="Tests"
                  icon={<Icon icon="task" />}
                >
                  {this.props.tests.map((test) => (
                    <Dropdown.Item key={test.id} eventKey={test.id}>
                      {test.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>

        <div className="run">
          <Button onClick={this.props.compile} appearance="ghost" block>
            <Icon icon="gears2" />
            {this.props.expanded && <span>Compile Project</span>}
          </Button>
          <Button onClick={this.props.runTest} appearance="primary" block>
            <Icon icon="play" />
            {this.props.expanded && <span>Run Test</span>}
          </Button>
        </div>

        <Modal
          backdrop={false}
          show={this.state.displayModal}
          onHide={this.closeModal}
        >
          <Modal.Header>
            <Modal.Title>What is it called?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body">
              <span>Give your file a name.</span>
              <Input
                onChange={(value) => this.setState({ promptValue: value })}
                placeholder="Name"
              />
              <span>What is the file type?</span>
              <InputPicker
                cleanable={false}
                onSelect={(value) => this.setState({ fileType: value })}
                defaultValue={this.state.fileType}
                value={this.state.fileType}
                data={this.selectData}
                block
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={() => this.closeModal("add")} appearance="primary">
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
