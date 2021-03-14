class IPCService {
  constructor() {
    this.callbacks = [];

    if (window.api) {
      window.api.receive("fromMain", (data) => {
        let cb = this.callbacks.find((c) => c.label === data.label);

        if (cb) {
          cb.callback(data.details);
        } else {
          console.warn(`No callback function for ${data.label}`);
        }
      });
    }
  }

  send(label, details) {
    if (window.api) {
      window.api.send("toMain", { label, details });
    }
  }

  on(label, callback) {
    this.callbacks.push({
      label,
      callback,
    });
  }
}

export default new IPCService();
