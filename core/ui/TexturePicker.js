(function(){
    var ui = glinamespace("gli.ui");
    
    var TexturePicker = function (context) {
        var self = this;
        this.context = context;
        
        var w = this.browserWindow = window.open("", "_blank", "location=no,menubar=no,scrollbars=no,status=no,toolbar=no,innerWidth=800,innerHeight=600");
        w.document.writeln("<html><head><title>Texture Browser</title></head><body style='margin: 0px; padding: 0px;'></body></html>");

        w.addEventListener("unload", function () {
            self.browserWindow.closed = true;
            self.browserWindow = null;
            context.ui.texturePicker = null;
        }, false);
        
        w.gli = window.gli;
        
        if (window["gliloader"]) {
            gliloader.load(["ui_css"], function () { }, w);
        }
        
        setTimeout(function () {
            self.setup();
        }, 0);
    };
    
    TexturePicker.prototype.setup = function () {
        var context = this.context;
        
        // Build UI
        var body = this.browserWindow.document.body;
        
        var toolbarDiv = document.createElement("div");
        toolbarDiv.className = "texture-picker-toolbar";
        body.appendChild(toolbarDiv);
        
        var pickerDiv = document.createElement("div");
        pickerDiv.className = "texture-picker-inner";
        body.appendChild(pickerDiv);
        
        function addTexture (texture) {
            var el = document.createElement("div");
            el.className = "texture-picker-item";
            pickerDiv.appendChild(el);
            
            texture.modified.addListener(this, function (texture) {
                //updateSize();
                // TODO: refresh view if selected
            });
            texture.deleted.addListener(this, function (texture) {
                //el.className += " texture-item-deleted";
            });
        };
        
        // Append textures already present
        var textures = context.resources.getTextures();
        for (var n = 0; n < textures.length; n++) {
            var texture = textures[n];
            addTexture(texture);
        }
        
        // Listen for changes
        context.resources.resourceRegistered.addListener(this, function (resource) {
            if (glitypename(resource.target) == "WebGLTexture") {
                addTexture(resource);
            }
        });
    };
    
    TexturePicker.prototype.focus = function () {
        this.browserWindow.focus();
    };
    TexturePicker.prototype.close = function () {
        this.browserWindow.close();
        this.browserWindow = null;
        this.context.ui.texturePicker = null;
    };
    TexturePicker.prototype.isOpened = function () {
        return this.browserWindow && !this.browserWindow.closed;
    };
    
    ui.TexturePicker = TexturePicker;
})();
