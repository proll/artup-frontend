aup.l10n = {
    locale: (aup.language == "ru") ? "ru" : "en",   // Current locale codename
    default_locale: "ru",           // Default (fallback) locale codename
    always_localize : [ "header", "footer", "common" ],
    pages: {
        "test-page": {              // Page codename
            "test-string": {        // String codename
                selector: "#test",  // CSS-selector for replace strings
                en: "Testing",      // Locales
                ru: "Тестинг"
            }
        }
    },

    /**
     * Add page localizationn dictionary to localization object
     * @param page_name (required) - page codename
     * @param page_strings (optional) - l10n dictionary
     */
    add_page: function(page_name, page_strings) {
        if (page_name) {
            this.pages[page_name] = page_strings;
            return true;
        }
        return false;
    },

    /**
     * Localize element by codename
     * @param name (required) - string codename
     * @param custom_page (optional) - page codename, if not provided causes full scan for string codename
     * @param custom_locale (optional) - custom locale codename
     */
    localize: function(name, custom_page, custom_locale) {
        var loc = custom_locale || this.locale || this.default_locale;

        var l10n_object = this.get_l10n_object(name, custom_page);
        if (!l10n_object) return false;

        // Try to get localization
        var l10n_string = l10n_object[loc];
        if (!l10n_string) {
            // In case of failure, try to get default localization
            l10n_string = l10n_object[this.default_locale];
            // If not default localization - fail
            if (!l10n_string) return false;
        }

        // Localizing element
        this.change_element(l10n_object.selector, l10n_string, l10n_object.attr);
        return true;
    },

    /**
     * Returns localized string for codename
     * @param name (required) - string codename
     * @param custom_page (optional) - page codename, if not provided causes full scan for string codename
     * @param custom_locale (optional) - custom locale codename
     */
    localize_string: function(name, custom_page, custom_locale) {
        var loc = custom_locale || this.locale || this.default_locale;

        var l10n_object = this.get_l10n_object(name, custom_page);
        if (!l10n_object) return "";

        // Try to get localization
        var l10n_string = l10n_object[loc];
        if (!l10n_string) {
            // In case of failure, try to get default localization
            l10n_string = l10n_object[this.default_locale];
            // If not default localization - fail
            if (!l10n_string) return "";
        }

        // Returns localized string
        return l10n_string;
    },

    /**
     * Localize entire page by page codename
     * @param page (required) - page codename
     * @param custom_locale (optional) - custom locale codename
     * @param no_always (optional) - do not localize this.always_localize
     */
    localize_page: function(page, custom_locale, no_always) {
        if (!page) return false;
        var loc = custom_locale || this.locale || this.default_locale;

        log("Localize: " + page + " to: " + loc);

        var strings = this.pages[page];
        for (var string_id in strings) {
            var string = strings[string_id];
            if (string[loc]) {
                this.change_element(string.selector, string[loc], string.attr);
            } else if (string[this.default_locale]) {
                this.change_element(string.selector, string[this.default_locale], string.attr);
            }
        }

        if (!no_always) {
            for (var page in this.always_localize) {
                this.localize_page(this.always_localize[page], loc, true);
            }
        }

        return true;
    },

    /**
     * Localize entire all pages (may be slow)
     * @param custom_locale (optional) - custom locale codename
     */
    localize_all_pages: function(custom_locale) {
        var loc = custom_locale || this.locale || this.default_locale;

        for (var page_name in this.pages) {
            this.localize_page(page_name, loc, true);
        }

        for (var page in this.always_localize) {
            this.localize_page(this.always_localize[page], loc, true);
        }

        return true;
    },

    /**
     * (private method) Returns localization object by string codename
     * @param name (required) - string codename
     * @param custom_page (optional) - page codename, if not provided causes full scan for string codename
     */
    get_l10n_object: function(name, custom_page) {
        // If custom_page not provided start full search
        // until first occurrence of string codename
        var page = custom_page;
        if (!page) {
            var found = false;
            for (var page_name in this.pages) {
                var strings = this.pages[page_name];
                for (var string_id in strings) {
                    if (string_id == name) {
                        page = page_name;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }

        return this.pages[page][name];
    },

    /**
     * (private method) Helper
     * @param selector (required) - element selector
     * @param value (required) - value for set
     * @param key (optional) - element attr name or "html"
     */
    change_element: function(selector, value, key) {
        if (!key || key == "html") {
            $(selector).html(value);
        } else {
            $(selector).attr(key, value);
        }
    }
};
