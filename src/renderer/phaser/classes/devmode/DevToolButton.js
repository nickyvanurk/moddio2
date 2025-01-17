var DevToolButton = /** @class */ (function () {
    function DevToolButton(devModeTools, text, tooltipLabel, tooltipText, texture, x, y, w, h, container, func, value, hoverChildren, defaultVisible) {
        if (defaultVisible === void 0) { defaultVisible = true; }
        var _this = this;
        var _a;
        this.devModeTools = devModeTools;
        this.isHover = false;
        this.name = text;
        this.hoverChildren = hoverChildren;
        var scene = devModeTools.scene;
        // @ts-ignore
        var button = this.button = scene.add.rexRoundRectangle(x + w / 2, y + h / 2, w, h, 5, devModeTools.COLOR_WHITE);
        button.setStrokeStyle(1, 0x000000, 1);
        button.setInteractive();
        button.setVisible(defaultVisible);
        container.add(button);
        if (texture) {
            var image = this.image = scene.add.image(x + w / 2 - h * 0.4, y + h * 0.1, texture)
                .setDisplaySize(h * 0.8, h * 0.8)
                .setOrigin(0);
            container.add(image);
        }
        else {
            var label = this.label = scene.add.bitmapText(x + w / 2, y + h / 2, BitmapFontManager.font(scene, 'Verdana', false, false, '#000000'), text, 16);
            label.setOrigin(0.5);
            label.letterSpacing = 1.3;
            label.setVisible(defaultVisible);
            container.add(label);
            /*if (scene.renderer.type === Phaser.CANVAS) {
                const rt = scene.add.renderTexture(
                    label.x, label.y,
                    label.width, label.height
                );
                rt.draw(label, label.width / 2, label.height / 2);
                rt.setOrigin(0.5);
                container.add(rt);

                label.visible = false;
            }*/
        }
        button.on('pointerdown', function () {
            if (value || value === 0)
                func(value);
            else
                func();
        });
        button.on('pointerover', function () {
            var _a;
            scene.gameScene.input.setTopOnly(true);
            scene.pointerInsideButtons = true;
            devModeTools.tooltip.showMessage(tooltipLabel, tooltipText);
            _this.isHover = true;
            (_a = _this.hoverChildren) === null || _a === void 0 ? void 0 : _a.map(function (btn) {
                btn.button.setVisible(true);
                btn.label.setVisible(true);
            });
            clearTimeout(_this.timer);
        });
        button.on('pointerout', function () {
            //this.hideHoverChildren(350);
            scene.pointerInsideButtons = false;
            devModeTools.tooltip.fadeOut();
        });
        (_a = this.hoverChildren) === null || _a === void 0 ? void 0 : _a.map(function (btn) {
            btn.button.on('pointerout', function () {
                //this.hideHoverChildren(350);
            });
            btn.button.on('pointerdown', function () {
                //this.hideHoverChildren(0);
            });
        });
    }
    //not using currently
    /*hideHoverChildren(delay) {
        this.isHover = false;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (delay === 0 || !this.isHover && this.hoverChildren?.every((btn) => !btn.isHover)) {
                this.hoverChildren?.map((btn) => {
                    btn.button.setVisible(false);
                    btn.label.setVisible(false);
                });

            }
        }, delay);
    }*/
    DevToolButton.prototype.highlight = function (mode) {
        switch (mode) {
            case 'hidden':
                this.hidden = true;
                this.active = false;
                this.button.setFillStyle(this.devModeTools['COLOR_GRAY'], 1);
                break;
            case 'active':
                this.active = true;
                this.hidden = false;
                this.button.setFillStyle(this.devModeTools['COLOR_LIGHT'], 1);
                break;
            case 'no':
                if (!this.hidden) {
                    this.active = false;
                    this.button.setFillStyle(this.devModeTools['COLOR_WHITE'], 1);
                }
                break;
        }
    };
    DevToolButton.prototype.increaseSize = function (value) {
        this.button.setScale(1 + (Number(value) * 0.1), 1 + (Number(value) * 0.05));
    };
    return DevToolButton;
}());
//# sourceMappingURL=DevToolButton.js.map