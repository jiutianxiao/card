## 接口
##### appLink
````  
说明：用来存储当前活跃的websocket链接
类型：对象
属性：
    team 数组，用来存储对局对象
    multiple 数值型，用来存储翻的倍数
实例：
    {
        房间号码:{
            house:[ctx]//当前房间对象,
            multiple:倍数，
            num：当前人数,
            state:[]
        }
    }
````




##### house
````$xslt
说明：house接口为游戏主接口
状态：快速匹配:1、准备:2、开始:3

````