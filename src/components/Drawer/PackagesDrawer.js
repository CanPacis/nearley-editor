import "./Drawer.css";
import React from "react";
import {
  Sidenav,
  Nav,
  Checkbox,
  Icon,
  Button,
  Modal,
  Input,
  Dropdown,
  Tag,
} from "rsuite";

export default class PackagesDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayModal: false,
      dev: false,
      promptValue: "",
    };
  }

  closeModal = (type) => {
    if (type === "add") {
      if (this.state.promptValue.trim() !== "") {
        this.props.installPackage(this.state.dev, this.state.promptValue);
        this.setState({ dev: false });
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
          <Sidenav
            defaultOpenKeys={["dependencies", "dev-dependencies"]}
            onSelect={this.handleSelect}
            expanded={this.props.expanded}
          >
            <Sidenav.Body>
              {!this.props.expanded && (
                <div className="run">
                  <Button onClick={this.props.expand} appearance="ghost" block>
                    <Icon icon={this.props.expanded ? "compress" : "expand"} />
                  </Button>
                </div>
              )}
              <Nav>
                <Dropdown
                  eventKey="dependencies"
                  title="Main"
                  icon={<Icon icon="archive" />}
                >
                  {this.props.packages.main.map((dependency) => (
                    <Dropdown.Item key={dependency.id} eventKey={dependency.id}>
                      {dependency.name}{" "}
                      <Tag color="orange">{dependency.version}</Tag>
                    </Dropdown.Item>
                  ))}
                </Dropdown>
                <Dropdown
                  eventKey="dev-dependencies"
                  title="Dev"
                  icon={<Icon icon="briefcase" />}
                >
                  {this.props.packages.dev.map((dependency) => (
                    <Dropdown.Item key={dependency.id} eventKey={dependency.id}>
                      {dependency.name}{" "}
                      <Tag color="orange">{dependency.version}</Tag>
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>

        <div className="run">
          <Button onClick={this.openModal} appearance="ghost" block>
            <Icon icon="cart-arrow-down" />
            {this.props.expanded && <span>Install Package</span>}
          </Button>
          <Button
            onClick={this.props.reinstallPackages}
            appearance="primary"
            block
          >
            <Icon icon="download" />
            {this.props.expanded && <span>Reinstall Packages</span>}
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
              <span>Give me a package name.</span>
              <Input
                onChange={(value) => this.setState({ promptValue: value })}
                placeholder="Name"
              />
              <Checkbox
                onChange={(_, checked) => this.setState({ dev: checked })}
                value={this.state.dev}
              >
                {" "}
                Add this package as a development dependency.
              </Checkbox>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={() => this.closeModal("add")} appearance="primary">
              Install
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
