export default class socket {
    constructor() {
        this._flag = null;
        this.scoket = null;
    }

    CreateWebSocket(urlValue) {
        if (window.WebSocket) {
            this._flag = "window";
            this.scoket = new WebSocket(urlValue);
            return this
        }
        if (window.MozWebSocket) {
            this._flag = "window";
            this.scoket = new MozWebSocket(urlValue);
            return this
        }
        if (wx) {
            this._flag = "wx";
            this.scoket = wx.connectSocket({
                urlValue,
                method: 'GET',
            });
            return this
        }
        return false;
    }

    message(callback) {
        if (this._flag === "wx") {
            this.scoket.onSocketMessage(callback);
        } else {
            this.scoket.addEventListener("message", callback)
        }
    }

    open(callback) {
        if (this._flag === "wx") {
            this.scoket.onSocketOpen(callback);
        } else {
            this.scoket.addEventListener("open", callback)
            /* this.scoket.onopen=function (data) {
                 callback(data)
             };*/
        }
    }

    send(data) {
        console.log(data);
        if (this._flag === "wx") {
            this.scoket.sendSocketMessage({
                data:JSON.stringify(data)
            });
        } else {
            this.scoket.send(JSON.stringify(data));
        }
    }

    close(callback) {
        if (this._flag === "wx") {
            this.scoket.onSocketClose(callback);
        } else {
            this.scoket.addEventListener("close", callback)
        }
    }
}

