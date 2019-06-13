// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    loadImgFromUrl(target, imgUrl, p, tag) {
        if (!imgUrl) return;
        var self = target;
        var loadCb = function (err, img) {
            if (err) return;
            cc.textureCache.addImage(imgUrl);
            var texture2d = new cc.Texture2D();
            texture2d.initWithElement(img);
            texture2d.handleLoadedTexture();
            var sp = new cc.Sprite();
            sp.initWithTexture(texture2d);
            self.addChild(sp);
            sp.x = p.x;
            sp.y = p.y;
            sp.tag = tag;
        };
        // cc.loader.loadImg(imgUrl, {isCrossOrigin: false}, loadCb);
    }
    // update (dt) {},
});
