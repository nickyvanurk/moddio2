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
var PhaserButtonBar = /** @class */ (function (_super) {
    __extends(PhaserButtonBar, _super);
    function PhaserButtonBar(scene) {
        var _this = _super.call(this, scene) || this;
        _this.scene = scene;
        _this.buttons = {};
        _this.buttonSize = 45;
        _this.buttonInterval = 4;
        _this.buttonRadius = 3;
        if (taro.isMobile) {
            _this.buttonSize = 50;
            _this.buttonInterval = 6;
            _this.buttonRadius = 25;
        }
        _this.updatePosition();
        scene.add.existing(_this);
        taro.client.on('update-abilities-position', function () {
            _this.updatePosition();
        });
        return _this;
    }
    PhaserButtonBar.prototype.addButton = function (abilityId, ability, key) {
        var button = new PhaserButton(this.scene, ability, abilityId, key, 'description', ability === null || ability === void 0 ? void 0 : ability.iconUrl, Object.values(this.buttons).length * (this.buttonSize + this.buttonInterval), 0, this.buttonSize * window.devicePixelRatio, this.buttonRadius * window.devicePixelRatio);
        this.buttons[key] = button;
        this.add(button);
        this.updatePosition();
        return button;
    };
    PhaserButtonBar.prototype.updatePosition = function () {
        if (taro.isMobile) {
            taro.mobileControls.updateButtonPos();
        }
    };
    PhaserButtonBar.prototype.clear = function () {
        Object.values(this.buttons).forEach(function (button) { return button.destroy(); });
        this.buttons = {};
    };
    return PhaserButtonBar;
}(Phaser.GameObjects.Container));
//# sourceMappingURL=PhaserButtonBar.js.map