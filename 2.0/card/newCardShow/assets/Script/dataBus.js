// import dataBusInit from "./dataBusInit"
let dataBusCreate = () => {
    return {
        url: "http://localhost:3000/",
        socket: null,
        houseIndex: null,//房间号
        people: 0,//当前房间人数
        index: "",//用户索引
        activeIndex: "",//当前出牌人
        activeLastIndex: "",//上次操作人
        lastIndex: "",//上一个出牌人
        banker: "",
        spade: "",
        model: {
            updata: true,
            active: "index"
        },
        eleCards: {
            num: [],
            cards: [],
            template: null
        },
        myCards: {
            updata: true,
            cards: {
                updata: true,
                data: []
            },
            banker: false,
            spade: false,
        },
        top: {
            updata: true,
            cards: {
                updata: true,
                data: [],
                text: "",
                num: "",
            },
            banker: false,
            spade: false,
            imageSrc: {
                updata: false,
                data: ""
            }
        },
        left: {
            updata: true,
            cards: {
                updata: false,
                data: [],
                text: "",
                num: "",
            },
            banker: false,
            spade: false,
            imageSrc: {
                updata: false,
                data: ""
            }
        },
        right: {
            updata: true,
            cards: {
                updata: false,
                data: [],
                text: "",
                num: "",
            },
            banker: false,
            spade: false,
            imageSrc: {
                updata: false,
                data: ""
            }
        },
        center: {
            updata: true,
            cards: {
                updata: true,
                data: [],
                text: "",
            },
        },
        manIndex: {},
        err: {
            updata: false,
            text: "",
            route: ""
        },
        ending: {
            updata: false
        }
    }
}
let dataBus = dataBusCreate()
// let dataBusInit = () => {
//     let temp = dataBusCreate();
//     dataBus[0] = temp[0];
// }

// export { dataBusInit }
export default dataBus
