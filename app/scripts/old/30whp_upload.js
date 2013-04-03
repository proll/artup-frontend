WHP.upload = {
    allowed_types: /image.*/i,

    resize_width: 1000,
    resize_height: 1000,

    offset_x: 0,

    imgCropTop: 0,
    imgCropLeft: 0,

    file_input: "#upload-file",
    image_preload: null,
    image_preview: null,
    image_reposition: null,
    canvas: null,
    canvas_context: null,

    breadcrumbs: null,
    breadcrumb1: null,
    breadcrumb2: null,
    breadcrumb3: null,

    upload_main: null,
    upload_facebook: null,
    upload_instagram: null,

    upload_gallery: null,

    photo_editor: null,

    stories: null,
    stories_wrapper: null,

    success: null,
    success_text: null,

    dragging: null,

    init: function() {
        this.canvas = document.getElementById("photo-canvas");
        this.canvas_context = this.canvas.getContext("2d");
        this.image_preload = document.getElementById("image-preload");
        this.image_reposition = document.getElementById("image-reposition");
        //this.image_preview = document.getElementById("photo-canvas-preview");

        this.breadcrumbs = $("#upload-breadcrumbs");
        this.breadcrumb1 = $("#upload-breadcrumb-1");
        this.breadcrumb2 = $("#upload-breadcrumb-2");
        this.breadcrumb3 = $("#upload-breadcrumb-3");

        this.upload_main = $("#upload-source");
        this.upload_facebook = $("#upload-facebook");
        this.upload_instagram = $("#upload-instagram");

        this.upload_gallery = $("#upload-gallery-select");

        this.photo_editor = $("#upload-photo");

        this.stories = $("#upload-stories");
        this.stories_wrapper = $("#upload-stories-wrapper");

        this.success = $("#upload-success-container");
        this.success_text = $("#upload-success");

        var self = this;
        this.breadcrumb1.click(function () {
            self.showMain()
        });
        this.breadcrumb2.click(function () {
            self.showPhotoEditor()
        });
        $("#upload-from-local").click(function () {
            if (browser.firefox) $(self.file_input).click();
        });
        $("#upload-from-facebook").click(function () {
            self.fromFacebook()
        });
        $("#upload-from-instagram").click(function () {
            self.fromInstagram()
        });
        $("#upload_close").click(function () {
            $("#upload-exit").fadeIn();
        });
        $("#upload-exit-quit").click(function() {
            $("#upload-exit").fadeOut();
            self.close();
        });
        $("#upload-exit-cancel").click(function() {
            $("#upload-exit").fadeOut();
        });

        self.fromLocal();
    },

    fromLocal: function() {
        var self = this;

        $(this.file_input).change(function(e) {
            log("FILE CHANGE");
            if ($(this).val() == "") return false;

            var file = e.target.files[0];
            $(this).val("");

            if (!file) {
                log("NO FILES");
                return false;
            }

            log(file);

            if (!self.allowed_types.test(file.type)) {
                log('WRONG FILETYPE: ' + file.type);
                self.success_text.html("Wrong file type. <br/>Please select an image.");
                self.success.fadeIn().delay(2000).fadeOut();
                return true;
            }

            self.success_text.html("Processing...");
            self.success.fadeIn();

            var reader = new FileReader();
            reader.onload = reader.onloadend = function(e) {
                self.loadImg(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    },

    fromFacebook: function() {
        this.breadcrumbs.show();
        this.upload_main.fadeOut();
        this.upload_facebook.fadeIn();

        var self = this;
        $("#upload-facebook .upload-source-header").click(function() {
            self.showMain();
        });

        FB.getLoginStatus(bind(function (response) {
            if (response.status == "connected")
            {
                log("Facebook : user was succesfully connected! :)");
            }else{
                log("Facebook : user was not connected! :(");
            }
        }, this));

        FB.api('/me/albums', function(response) {
            log(response);
            var items_container = $("#upload-facebook-items");
            items_container.html("");
            if (response.error) {
                items_container.html("No auth");
            } else {
                for (var i in response.data) {
                    var album = response.data[i];
                    items_container.append('<div class="upload-source-item" data-id="' + album.id + '" data-name="' + album.name + '">' + album.name + '&nbsp;<div class="upload-arrow-right"></div></div>');
                }
            }
        });

        $("#upload-facebook-items .upload-source-item").live("click", function() {
            self.upload_gallery.fadeIn();
            var id = $(this).attr("data-id");
            var album = $(this).attr("data-name");

            self.upload_gallery.find(".upload-gallery-header").html("Facebook");
            self.upload_gallery.find("#upload-gallery-name").html(album);
            self.upload_gallery.find("#upload-gallery").html("");

            FB.api('/' + id + '/photos', function(response) {
                log(response);
                self.upload_gallery.find("#upload-gallery").html("");
                if (response.error) {
                    self.upload_gallery.find("#upload-gallery-name").html("Error");
                } else {
                    var gallery = self.upload_gallery.find("#upload-gallery");
                    for (var i in response.data) {
                        var image_small = response.data[i].images[5];
                        var image_orig = response.data[i].images[0];
                        gallery.append('<div class="upload-gallery-item" data-url="' + image_orig.source + '" style="background-image: url(\'' + image_small.source +  '\');"></div>');
                    }
                }
            });
        });

        $(".upload-gallery-header").click(function() {
            self.upload_gallery.fadeOut();
        });

        $(".upload-gallery-item").live("click", function() {
            $(".upload-gallery-item").css("opacity", "0.3");
            $(this).css("opacity", "1.0");

            var image_url = $(this).attr("data-url");
            log("Facebook image: " + image_url);

            self.loadImg(image_url, function() {
                self.upload_gallery.fadeOut();
            });
        });
    },

    fromInstagram: function() {
        this.breadcrumbs.show();
        this.upload_main.fadeOut();
        this.upload_instagram.fadeIn();

        var self = this;

        $("#upload-instagram .upload-gallery-header").click(function() {
            self.showMain();
        });

        IG.init({
            client_id: "f4baba4e9447448e9d8476176f87e4bd",
            check_status: true, // check and load active session
            cookie: true // persist a session via cookie
        });

        var gallery = $("#upload-instagram").find(".upload-gallery");
        gallery.html("");
        IG.login(function (response) {
            if (response.session) {
                var token = response.session.access_token;
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    cache: false,
                    url: "https://api.instagram.com/v1/users/17522907/media/recent/?access_token=" + token,
                    success: function(response) {
                        gallery.html("");
                        var length = response.data != 'undefined' ? response.data.length : 0;
                        for(var i = 0; i < length; i++) {
                            var image_small = response.data[i].images.low_resolution.url;
                            var image_orig = response.data[i].images.standard_resolution.url;
                            gallery.append('<div class="upload-gallery-item" data-url="' + image_orig + '" style="background-image: url(\'' + image_small +  '\');"></div>');
                        }
                    }
                });
            }
        }, {scope: ['basic']});

        $(".upload-gallery-item").live("click", function() {
            $(".upload-gallery-item").css("opacity", "0.3");
            $(this).css("opacity", "1.0");

            var image_url = $(this).attr("data-url");
            log("Instagram image: " + image_url);

            self.loadImg(image_url, function() {
                self.upload_gallery.fadeOut();
            });
        });
    },

    showPhotoEditor: function() {
        this.breadcrumbs.show();
        this.breadcrumb1.attr("class", "prev");
        this.breadcrumb2.attr("class", "active");
        this.breadcrumb3.attr("class", "");

        this.photo_editor.fadeIn();
        this.upload_main.fadeOut();
        this.upload_facebook.hide();
        this.upload_instagram.hide();
        this.stories_wrapper.fadeOut();
        this.success.fadeOut();

        $("#upload-photo-share-items input").change(function() {
//            var img = $("#upload-photo-share-items label[for=" + this.id + "] img");
            var label = $("#upload-photo-share-items label[for=" + this.id + "]");
            if (this.checked) {
                label.addClass("checked");
//                img.attr("src", img.attr("data-color"));
            } else {
                label.removeClass("checked");
//                img.attr("src", img.attr("data-grey"));
            }
        });
        $("#upload-photo-share-items input").attr("checked", false);
        $("#share-fb-label").css("display", WHP.auth.userSettings.opengraph ? "none" : "inline-block");
        $("#upload-photo-descr").val("");

        var self = this;
        $("#upload-photo-next").click(function() { self.showStories() });
        $("#upload-photo-reposition").click(function() { self.showRepositioning() });
        $("#upload-photo-descr").bind('focusin', function() {
            $(this).attr("placeholder", "");
        });
        $("#upload-photo-descr").bind('focusout', function() {
            $(this).attr("placeholder", "Description");
        });
    },

    showRepositioning: function() {
        var self = this;

        var cropTop = this.imgCropTop;
        var cropLeft = this.imgCropLeft;

        $("#upload-photo-repositioning").fadeIn();
        $("#upload-photo-repositioning-done").click(function() {
            $("#upload-photo-repositioning").fadeOut();
        });

        if (self.image_reposition.width > self.image_reposition.height) {
            $(self.image_reposition).css("height", "305px");
            var imageSide = $(self.image_reposition).width();
            var stopPosition = $("#upload-photo-reposition-block").width() - imageSide;
            $(self.image_reposition).draggable({
                axis: "x",
                scroll: false,
                drag: function(event, ui) {
                    if (ui.position.left >= 0) return false;
                    if (ui.position.left <= stopPosition) return false;
                    return true;
                },
                stop: function(event, ui) {
                    log("Ui. Position: " + ui.position.left + " offset: " + ui.offset.left);
                    log("Crop. Top: 0 Left: " + (-ui.position.left));
                    cropTop = 0;
                    cropLeft = - Math.ceil(ui.position.left / imageSide * self.image_preload.width);
                    if (cropLeft >= self.image_preload.width - self.image_preload.height) {
                        cropLeft = self.image_preload.width - self.image_preload.height;
                    }
                    if (cropLeft < 0) cropLeft = 0;
                }
            });
        } else if (self.image_reposition.width < self.image_reposition.height) {
            $(self.image_reposition).css("width", "305px");
            var imageSide = $(self.image_reposition).height();
            var stopPosition = $("#upload-photo-reposition-block").height() - imageSide;
            $(self.image_reposition).draggable({
                axis: "y",
                scroll: false,
                drag: function(event, ui) {
                    if (ui.position.top >= 0) return false;
                    if (ui.position.top <= stopPosition) return false;
                    return true;
                },
                stop: function(event, ui) {
                    log("Ui. Position: " + ui.position.top + " offset: " + ui.offset.top);
                    log("Crop. Top: "  + (-ui.position.top) + " Left: 0");
                    cropTop = - Math.ceil(ui.position.top / imageSide * self.image_preload.height);
                    if (cropTop >= self.image_preload.height - self.image_preload.width) {
                        cropTop = self.image_preload.height - self.image_preload.width;
                    }
                    if (cropTop < 0) cropTop = 0;
                    cropLeft = 0;
                }
            });
        } else {
            $(self.image_reposition).css("width", "305px");
            $(self.image_reposition).draggable({
                drag: function(event, ui) {
                    return false; // хак для хрома, оначе у него падает рендеринг
                }
            });
            cropTop = 0;
            cropLeft = 0;
        }

        $("#upload-photo-reposition-done").click(function() {
            self.cropImg(cropLeft, cropTop, self.image_preload.width, self.image_preload.height);
            $("#upload-photo-repositioning").fadeOut();
        });
    },

    showStories: function() {
        var self = this;

        this.breadcrumbs.show();
        this.breadcrumb1.attr("class", "prev");
        this.breadcrumb2.attr("class", "prev");
        this.breadcrumb3.attr("class", "active");

        this.stories_wrapper.fadeIn();
        this.photo_editor.fadeOut();
        this.upload_main.hide();
        this.upload_facebook.hide();
        this.upload_instagram.hide();

        $("#upload-stories .stories_content, #upload-stories .dailystories_content").html("");
        $("#skip-stories").click(function() { self.completeUpload("timeline", 0) });

        WHP.pages.stories.init(true);
        WHP.pages.stories.loadCats();
    },

    completeUpload: function(area, story_id) {
        this.breadcrumbs.hide();
        this.stories_wrapper.fadeOut();
        this.success_text.html("Uploading...");
        this.success.fadeIn();

        var is_fb = $("#share-fb").is(":checked") ? 1 : 0;
        var is_tw = $("#share-twi").is(":checked") ? 1 : 0;
        var is_vk = $("#share-vk").is(":checked") ? 1 : 0;
        var is_pin = 0;
        var is_og =  WHP.auth.userSettings.opengraph ? 1 : 0;

        console.debug("Upload image...........", {
            area: area,
            story: story_id,
            fb: is_fb,
            tw: is_tw,
            vk: is_vk,
            pinterest: is_pin,
            opengraph: is_og
        });

        var self = this;

        var data_url = self.canvas.toDataURL("image/jpeg");

        $.ajax({
            url: WHP.netcalls.uploadCall,
            data: {
                area: area,
                story: story_id,
                caption: $("#upload-photo-descr").val(),
                fb: is_fb,
                tw: is_tw,
                vk: is_vk,
                pinterest: is_pin,
                opengraph: is_og,
                file: data_url
            },
            type: "POST",
            timeout: WHP.netTimeOut,
            success: function (r) {
                log("OK");
                log(r);
                if (!r.error) {
                    self.success_text.html("Success!");
                    $("#upload_close").unbind("click").click(function () { self.close() });
                    setTimeout(function() {
                        self.close();
                        WHP.pages.timeline.show();
                        document.location.href = "/timeline";
                    }, 1500);
                } else {
                    self.success_text.html("Upload failed!");
                    setTimeout(function() {
                        self.success.hide();
                        self.showPhotoEditor();
                    }, 1500);
                }
            },
            error: function(r) {
                log("ERROR");
                log(r);
                self.success_text.html("Upload failed!");
                setTimeout(function() {
                    self.success.hide();
                    self.showPhotoEditor();
                }, 1500);
            }
        });
    },

    loadImg: function(image_url, callback) {
        var self = this;
        self.image_reposition.src = image_url;
        self.image_reposition.style.top = 0;
        self.image_reposition.style.left = 0;
        self.image_reposition.style.height = self.image_reposition.style.width = "auto";

        self.image_preload.onload = function () {
            self.cropImg(0, 0, this.width, this.height);
            self.showPhotoEditor();
            if (callback) callback();
        };
        self.image_preload.src = image_url;
    },

    cropImg: function(left, top, width, height) {
        this.imgCropTop = top = top || 0;
        this.imgCropLeft = left = left || 0;
        width = width || this.image_preload.width;
        height = height || this.image_preload.height;
        var imageSide = Math.min(width, height);

        log("Crop image left: " + left + " top: " + top + " width: " + width + " height: " + height + " side: " + imageSide);
        this.canvas_context.clearRect(0, 0, this.resize_width, this.resize_height);
        this.canvas_context.drawImage(this.image_preload, left, top, imageSide, imageSide, 0, 0, this.resize_width, this.resize_height);
        //this.image_preview.src = this.canvas.toDataURL("image/jpeg");
    },

    show: function() {
        $("#upload_popup").fadeIn();
        WHP.contentCont.fadeOut();

        this.init();
        this.showMain();

        // Временно
        $(this.file_input).click();
    },

    showMain: function() {
        this.breadcrumbs.hide();
        this.breadcrumbs.find("div").removeClass("active").removeClass("prev");
        this.breadcrumb1.addClass("active");

        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            this.success.html("Sorry. <br/>Your browser does not support some important features. <br/>Try update it or install modern browser.").show();
        } else {
            this.upload_main.fadeIn();
            this.upload_facebook.fadeOut();
            this.upload_instagram.fadeOut();
            this.photo_editor.fadeOut();
            this.stories_wrapper.fadeOut();
        }
    },

    close: function() {
        this.success.hide();
        $("#upload_popup").fadeOut();
        WHP.contentCont.show();
    }
};