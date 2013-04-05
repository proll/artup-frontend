aup.newsletter = {

    init: function() {
        var self = this;
        $("#newsletter-close").click(function() { self.hide() });
    },

    show: function() {
        this.init();

        $("#newsletter_popup").fadeIn();
        aup.contentCont.fadeOut();
    },

    send: function() {

    },

    hide: function() {
        $("#newsletter_popup").fadeOut();
        aup.contentCont.fadeIn();
    }
};