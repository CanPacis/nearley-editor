import React from "react";
import { Button } from "rsuite";

export default class SettingsPage extends React.Component {
  render() {
    return (
      <div>
        <p>Settings Page</p>
        <Button appearance="primary" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }
}
