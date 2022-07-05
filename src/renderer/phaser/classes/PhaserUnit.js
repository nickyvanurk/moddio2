var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PhaserUnit = /** @class */ (function (_super) {
    __extends(PhaserUnit, _super);
    function PhaserUnit(scene, entity) {
        var _this = _super.call(this, scene, entity, "unit/".concat(entity._stats.type)) || this;
        _this.attributes = [];
        _this.scene = scene;
        var translate = entity._translate;
        _this.gameObject = scene.add.container(translate.x, translate.y, [_this.sprite]);
        var label = _this.label = scene.add.text(0, 0, 'cccccc');
        label.setOrigin(0.5);
        _this.gameObject.add(label);
        Object.assign(_this.evtListeners, {
            followListener: entity.on('follow', _this.followListener, _this),
            stopFollowListener: entity.on('stop-follow', _this.stopFollowListener, _this),
            updateLabelListener: entity.on('update-label', _this.updateLabelListener, _this),
            showLabelListener: entity.on('show-label', _this.showLabelListener, _this),
            hideLabelListener: entity.on('hide-label', _this.hideLabelListener, _this),
            fadingTextListener: entity.on('fading-text', _this.fadingTextListener, _this),
            renderAttributesListener: entity.on('render-attributes', _this.renderAttributesListener, _this),
            updateAttributeListener: entity.on('update-attribute', _this.updateAttributeListener, _this),
            renderChatListener: entity.on('render-chat-bubble', _this.renderChatListener, _this),
        });
        return _this;
    }
    PhaserUnit.prototype.transform = function (data) {
        this.gameObject.setPosition(data.x, data.y);
        this.sprite.rotation = data.rotation;
        if (this.chat)
            this.chat.update(this.gameObject.x, this.gameObject.y);
        var flip = this.entity._stats.flip;
        this.sprite.setFlip(flip % 2 === 1, flip > 1);
    };
    PhaserUnit.prototype.scale = function (data) {
        this.sprite.setScale(data.x, data.y);
    };
    PhaserUnit.prototype.followListener = function () {
        console.log('PhaserUnit follow', this.entity.id()); // TODO remove
        var camera = this.scene.cameras.main;
        if (camera._follow === this.gameObject) {
            return;
        }
        camera.startFollow(this.gameObject, true, 0.05, 0.05);
    };
    PhaserUnit.prototype.stopFollowListener = function () {
        console.log('PhaserUnit stop-follow', this.entity.id()); // TODO remove
        this.scene.cameras.main.stopFollow();
    };
    PhaserUnit.prototype.updateLabelListener = function (data) {
        console.log('PhaserUnit update-label', this.entity.id()); // TODO remove
        var label = this.label;
        label.visible = true;
        label.setFontFamily('Verdana');
        label.setFontSize(16);
        label.setFontStyle(data.bold ? 'bold' : 'normal');
        label.setFill(data.color || '#fff');
        var strokeThickness = ige.game.data.settings
            .addStrokeToNameAndAttributes !== false ? 4 : 0;
        label.setStroke('#000', strokeThickness);
        label.setText(data.text || '');
        label.y = -25 -
            Math.max(this.sprite.displayHeight, this.sprite.displayWidth) / 2;
        label.setScale(1.25);
    };
    PhaserUnit.prototype.showLabelListener = function () {
        console.log('PhaserUnit show-label', this.entity.id()); // TODO remove
        this.label.visible = true;
    };
    PhaserUnit.prototype.hideLabelListener = function () {
        console.log('PhaserUnit hide-label', this.entity.id()); // TODO remove
        this.label.visible = false;
    };
    PhaserUnit.prototype.fadingTextListener = function (data) {
        console.log('PhaserUnit fading-text', this.entity.id()); // TODO remove
        new PhaserFloatingText(this.scene, {
            text: data.text || '',
            x: 0,
            y: 0,
            color: data.color || '#fff'
        }, this);
    };
    PhaserUnit.prototype.renderAttributesListener = function (data) {
        var _this = this;
        console.log('PhaserUnit render-attributes', data); // TODO remove
        var attributes = this.attributes;
        // release all existing attribute bars
        attributes.forEach(function (a) {
            PhaserAttributeBar.release(a);
        });
        attributes.length = 0;
        // add attribute bars based on passed data
        data.attrs.forEach(function (ad) {
            var a = PhaserAttributeBar.get(_this);
            a.render(ad);
            attributes.push(a);
        });
    };
    PhaserUnit.prototype.updateAttributeListener = function (data) {
        console.log('PhaserUnit update-attribute', data); // TODO remove
        var attributes = this.attributes;
        var a;
        var i = 0;
        for (; i < attributes.length; i++) {
            if (attributes[i].name === data.attr.type) {
                a = attributes[i];
                break;
            }
        }
        if (!data.shouldRender) {
            if (a) {
                PhaserAttributeBar.release(a);
                attributes.splice(i, 1);
            }
            return;
        }
        if (!a) {
            a = PhaserAttributeBar.get(this);
            attributes.push(a);
        }
        a.render(data.attr);
    };
    PhaserUnit.prototype.renderChatListener = function (text) {
        console.log('create-chat', text); // TODO remove
        if (this.chat) {
            this.chat.showMessage(text);
        }
        else {
            this.chat = new PhaserChatBubble(this.scene, text, this);
        }
    };
    PhaserUnit.prototype.destroy = function () {
        if (this.chat)
            this.chat.destroy();
        // release all instantiated attribute bars
        this.attributes.forEach(function (a) {
            PhaserAttributeBar.release(a);
        });
        this.attributes.length = 0;
        this.attributes = null;
        this.label = null;
        this.sprite = null;
        _super.prototype.destroy.call(this);
    };
    return PhaserUnit;
}(PhaserAnimatedEntity));
//# sourceMappingURL=PhaserUnit.js.map