import "./Drawer.css";
import React from "react";
import { Sidenav, Nav, Message, Icon, Button } from "rsuite";

export default class NotificationDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  buildMessages = () => {
    if (this.props.expanded) {
      if (this.props.notifications.length === 0) {
        return <p>No notifications</p>;
      } else {
        return this.props.notifications.map((notification, i) => (
          <Message
            key={i}
            type={notification.type}
            title={notification.title}
            description={<p>{notification.message}</p>}
          />
        ));
      }
    } else {
      return (
        <div
          className="notifications"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {this.props.notifications.map((notification, i) => {
            switch (notification.type) {
              case "success":
                return <Icon key={i} icon="check-circle" />;
              case "warning":
                return <Icon key={i} icon="exclamation-triangle" />;
              case "info":
                return <Icon key={i} icon="info" />;
              case "error":
                return <Icon key={i} icon="exclamation-circle" />;
            }
          })}
        </div>
      );
    }
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
              <Nav>{this.buildMessages()}</Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>
      </div>
    );
  }
}
