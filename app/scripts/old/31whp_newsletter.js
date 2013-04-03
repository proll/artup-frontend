WHP.newsletter = {

    init: function() {
        var self = this;
        $("#newsletter-close").click(function() { self.hide() });
    },

    show: function() {
        this.init();

        $("#newsletter_popup").fadeIn();
        WHP.contentCont.fadeOut();
    },

    send: function() {

    },

    hide: function() {
        $("#newsletter_popup").fadeOut();
        WHP.contentCont.fadeIn();
    }
};