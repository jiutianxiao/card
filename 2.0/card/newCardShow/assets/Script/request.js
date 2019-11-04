import dataBus from "./dataBus"
export default {
    gethouse(obj) {
        if (fetch) {
            fetch(dataBus.url + "gethouse").then(res => {
                return res.json();
            }).then(res => {
                dataBus.houseIndex = res.index
                if (res.userId)
                    localStorage.setItem("userId", res.userId);
                if (obj.after) {
                    obj.after();
                }
            });
        } else if (wx) {
            wx.request({
                url: dataBus.url + "gethouse",
                success(res) {
                    dataBus.houseIndex = res.index;
                    if (obj.after) {
                        obj.after();
                    }
                }
            })
        }
    },
    socket(obj) {
        let beforSocket = null;
        let afterSocket = null;
        if (obj) {
            beforSocket = obj.beforSocket;
            afterSocket = obj.afterSocket
        }
        var CreateWebSocket = (function () {
            return function (urlValue) {
                if (window.WebSocket) return new WebSocket(urlValue);
                if (window.MozWebSocket) return new MozWebSocket(urlValue);
                return false;
            }
        })()
        if (beforSocket) beforSocket();
        var webSocket = CreateWebSocket("ws://127.0.0.1:3000/test/123");
        webSocket.onopen = function (evt) {
            // 一旦连接成功，就发送第一条数据
            dataBus.socket = webSocket;
            webSocket.send(JSON.stringify(
                {
                    code: "1002",
                    houseIndex: dataBus.houseIndex,
                    id: localStorage.getItem("userId"),
                    headImg: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epS9bXfsQ9F40E6ib71nibWMJibxPZKUIGHhFgDicaq8gxC0y2uWVMCNxHDNWHQq3983kNqoqdRr5Mu6A/132"
                }));
            if (afterSocket) afterSocket();
            // webSocket.send(JSON.stringify({ state: 1 }));
            // dataBus.socket=webSocket.send(JSON.stringify({ state: 1 }));

        };
        // webSocket.onmessage = function (evt) {
        //     console.log(evt);
        // };
        // webSocket.onclose = function (evt) {
        //     webSocket.send("断开连接");
        //     console.log("Connection closed.")
        // };
    }
}