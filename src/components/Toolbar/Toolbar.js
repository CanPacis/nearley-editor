import "./Toolbar.css";
import React from "react";
import { Loader, Nav, Icon, Breadcrumb } from "rsuite";

export default class Toolbar extends React.Component {
  handleToolbarSelect = (activeKey) => {
    if (activeKey === "settings") {
      window.history.pushState({}, "Settings", "/settings");
      window.location.replace("/settings");
    } else {
      this.props.handleToolbarSelect(activeKey);
    }
  };

  render() {
    return (
      <div className="toolbar">
        <Nav
          appearance="subtle"
          activeKey={this.props.activeKey}
          onSelect={this.handleToolbarSelect}
        >
          <Nav.Item eventKey="explorer" icon={<Icon icon="explore" />}>
            Explorer
          </Nav.Item>
          <Nav.Item eventKey="notifications" icon={<Icon icon="bell" />}>
            Notifications
          </Nav.Item>
          <Nav.Item eventKey="packages" icon={<Icon icon="archive" />}>
            Packages
          </Nav.Item>
          <Nav.Item eventKey="git" icon={<Icon icon="git" />}>
            Git
          </Nav.Item>
          <Nav.Item eventKey="settings" icon={<Icon icon="cog" />}>
            Settings
          </Nav.Item>
        </Nav>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Breadcrumb separator=">">
            {this.props.breadcrumbs.map((breadcrumb) => (
              <Breadcrumb.Item key={breadcrumb} active>{breadcrumb}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
        <div className="processes">
          {this.props.processes[0] && (
            <Loader content={this.props.processes[0].label} />
          )}
        </div>
      </div>
    );
  }
}
