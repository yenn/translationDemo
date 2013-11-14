/**
 * Created by yenn on 11/13/13.
 */

if (typeof Object.create !== "function") {
    Object.create = function(o, callback) {
        var f = (callback == undefined ? function() {} : callback);

        f.prototype = o;
        return new f();
    };
};


var APP = {
    config : {
        api_key: "MKAntfpeZSKcG4RCo9/3Wwoydlc"
    },
    dict: {
        en: "English",
        ro: "Romanian",
        es: "Spanish",
        oc: "Occitan",
        mk: "Macedonian",
        fr: "French",
        oc_ran: "Okzitanisch",
        pt: "Portuguese",
        an: "Aragonese",
        eu: "Basque",
        ca: "Catalan",
        nb: "Norwegian",
        is: "Icelandic",
        gl: "Galician",
        nn: "Norwegian Nynorsk",
        cy: "Welsh",
        br: "Breton",
        bg: "Bulgarian",
        sv: "Swedish",
        da: "Danish",
        it: "Italian",
        eo: "Esperanto",
        nn_a:"Norwegian Bokmål"
    }
};