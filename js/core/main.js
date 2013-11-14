/**
 * Object handles interaction with translation engine
 */
APP.apertiumClient = function ($) {
    if (apertium == undefined) {
        throw new APP.exception.LibraryNotFound("Apertium client was not loaded");
    }

    var response = {};

    return {
        translate: function (query, source, target, callback) {
            apertium.translate(query, source, target, callback);
        },
        getResponse: function() {
            return response;
        },
        getSources: function() {
            return apertium.getSourceLanguages()
        },
        getTargets: function() {
            return apertium.getTargetLanguages()
        },
        getPairs: function() {
            return apertium.getSupportedLanguagePairs();
        }

    };
}(jQuery);

/**
 * Object handles working with supported language pairs
 */
APP.languages = function($){
    var languagePairs = APP.apertiumClient.getPairs()
        languages = {},
        listingSources = [];

    for(var i = 0; i < languagePairs.length; i++) {
        var pair = languagePairs[i];
        if (languages.hasOwnProperty(pair.source)) {
            if ($.inArray(pair.target, languages[pair.source]) == -1) {
                languages[pair.source].push(pair.target);
            }
        } else {
            languages[pair.source] = [];
            languages[pair.source].push(pair.target);
        }
        //add to list
        if ($.inArray(pair.source, listingSources) == -1) {
            listingSources.push(pair.source);
        }

    }
    return {
        get: function(lang) {
            return languages[lang];
        },
        listSources: function() {
            return listingSources;
        },
        /** @todo **/
        listTargets: function() {
            return listingSources;
        }
    }
}(jQuery);
/**
 * Object to handle manipulation of local storage
 */
APP.storage = function ($) {
    if (typeof(localStorage)  == undefined) {
        throw new APP.exception.NotSupported("Local storage is not supported in your browser. What about a modern browser?");
    }
    var genKey = function() {
        return new Date().getTime();
    }
    return {
        /**
         * The key is going to be the timestamp, so i can group by the date when filtering
         * @param key
         * @param data
         */
        set: function(key, data, from, to) {
            try {
                var timestamp = genKey();
                localStorage.setItem(timestamp, JSON.stringify({key: key, data: data, lang:from+"|"+to}));
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    throw new APP.exception.CustomException("Storage quota exceeded. Too bad.");
                }
            }
        },
        get: function(key) {
            return localStorage.getItem(key);
        },
        remove: function(key) {
            localStorage.removeItem(key);
        },
        list: function() {
            var data = [];
            for(var i in localStorage){
                data.push(i);
            }
            data = data.sort().reverse();
            data.forEach(function(el, index, array) {
                array[index] = JSON.parse(APP.storage.get(el));
            });
            return data;
        }
    }
}(jQuery)

//register listeners
for(var key in APP.events) {
    document.addEventListener(APP.events[key].type, APP.events[key].handler, false);
}

(function($){
    //reload storage
    document.dispatchEvent(APP.events.storageRefresh.event());
    document.dispatchEvent(APP.events.loadSelects.event());
    $('#translation_form').submit(function() {
        document.dispatchEvent(APP.events.submit.event);
        return false;
    });
    $('.lang_select').change(function() {
        document.dispatchEvent(APP.events.selectChange.event($(this).val(), $(this).hasClass('lang_select_from') ? 'from' : 'to'));
        return false;
    });
})(jQuery)

