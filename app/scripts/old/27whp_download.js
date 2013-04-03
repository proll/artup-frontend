WHP.download = {
    alreadyShown: false,  // для показа всего 1 раз
    dontShowFlag: false,
    popupHeight: 210,
    popupWidth: 440,

    init: function() {
        this.dontShowFlag = getCookie("download_dont_show");

        if (!this.dontShowFlag && WHP.controller.current_page != "" && !this.alreadyShown) {
            setTimeout(function() {
                var block = (WHP.auth.status) ? $("#download_popup_open_auth") : $("#download_popup_open_noauth");
                block.click();
            }, 2000);
        }
    },

    togglePopup: function(event) {
        event.stopPropagation();

        if ($("#download_popup_standard").is(":visible")) {
            this.hidePopup(event);
        } else {
            this.showPopup(event);
        }
        return false;
    },

    showPopup: function(event) {
        if (this.dontShowFlag) {
            WHP.controller.navigateTo("/");
            return;
        }

        this.alreadyShown = true;
        var offset = $(event.target).offset();
        var popup = $("#download_popup_standard");
        popup.css({  "top": (offset.top + 43) + "px",
                     "left": (offset.left - this.popupWidth / 2) + "px" });
        popup.fadeIn();
        event.preventDefault();
    },

    hidePopup: function(event) {
        $("#download_popup_standard").fadeOut();
    },

    dontShow: function(event) {
        event.stopPropagation();
        event.preventDefault();
        setCookie("download_dont_show", true, 300);
        this.dontShowFlag = true;
        $(".download_popup-checkbox").addClass("download_popup-checkbox_active");
        this.hidePopup();
    }
};



