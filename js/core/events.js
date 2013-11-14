/**
 * Created by yenn on 11/13/13.
 */

APP.events = {
    /**
     * Event manipulates notification placement
     */
    notification: {
        type: "Notification",
        event: function(message, type) {
            return new CustomEvent(
                "Notification",
                {
                    detail: {
                        message: message,
                        type: type
                    },
                    bubbles: true,
                    cancelable: true
                }
            )
        },
        handler: function(event) {
            switch (event.detail.type) {
                case "error":
                    $('#messages').html("<div class='alert alert-danger alert-sm alert-dismissable small'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"+ event.detail.message+"</div>");
                    break;
                case "notice":
                    $('#messages').html("<div class='alert alert-info'>"+ event.detail.message+"</div>");
                    break;
                default:
                    console.log(event.detail.message);
            }
        }
    },
    /**
     * Event removes displayed notification
     */
    notificationRemove: {
        type: "NotificationRemove",
        event: function() { return new CustomEvent("NotificationRemove",{})},
        handler: function(event) {$('#messages').html("");}
    },
    /**
     * Event loading select with initial values
     */
    loadSelects: {
        type: "LoadSelects",
        event: function() { return new CustomEvent("LoadSelects",{})},
        handler: function(event) {
            $.each(APP.languages.listSources(), function(key, value) {
                $('.lang_select').each(function(){
                    $(this).append("<option value='"+value+"'>"+(APP.dict.hasOwnProperty(value)?APP.dict[value]:value)+"</option>");
                })
            });
        }
    },
    /**
     * Event fired when onchange takes place on source selects and loads target select with corresponding values
     */
    selectChange: {
        type: "SelectChange",
        event: function(value, type) { return new CustomEvent("SelectChange",{
            detail: {
                val: value,
                type: type
            }
        })},
        handler: function(event) {
            console.log(event.detail);
            if (event.detail.type == "from") {
                var container = $('select.lang_select_to');
                $('select.lang_select_to').html("");
                $.each(APP.languages.get(event.detail.val), function(key, val) {
                    container.append("<option value='"+val+"'>"+(APP.dict.hasOwnProperty(val)?APP.dict[val]:val)+"</option>");
                });
            }
            /**
             * @todo also handle target language changes
             */
        }
    },
    /**
     * Event handles adding new search result to local storage
     */
    storageAdd: {
        type: "StorageAdd",
        event: function(key, content, lang_src, lang_trg) { return new CustomEvent(
            "StorageAdd",
            {
                detail: {
                    key: key,
                    content: content,
                    source: lang_src,
                    target: lang_trg
                }
            })
        },
        handler: function(event) {
            APP.storage.set(event.detail.key, event.detail.content, event.detail.source, event.detail.target);
            document.dispatchEvent(APP.events.storageRefresh.event());
        }
    },
    /**
     * Event refreshes display of local storage
     */
    storageRefresh: {
        type: "StorageRefresh",
        event: function() { return new CustomEvent("StorageRefresh",{})},
        handler: function(event) {
            var container = $('#sidebar div.list-data');
            container.html("");
            $.each(APP.storage.list(), function(index, values) {
                container.append("<a href='#' class='list-group-item' data-trans='"+values.data+"' data-lang='"+values.lang+"'>" + values.key +" (" +values.lang+")</a>");
            });
            $('#sidebar div.list-data a').click(function() {
                var container = $('#sidebar div.list-data a');
                container.each(function() {$(this).removeClass('active')});
                $(this).addClass('active');
                document.dispatchEvent(APP.events.flashBackSearch.event($(this).text(), $(this).attr('data-trans'), $(this).attr('data-lang')));
                return false;
            });

        }
    },
    /**
     * Event displays past search in main translation form
     */
    flashBackSearch: {
        type: "FlashBackSearch",
        event: function(from, to, sourceTarget) { return new CustomEvent("FlashBackSearch",{
            detail: {
                from: from,
                to: to,
                sourceTarget: sourceTarget
            }
        })},
        handler: function(event) {
            var split = event.detail.sourceTarget.split('|'),
                text = event.detail.from.substring(0, event.detail.from.indexOf('(') -1);

            $('#translation_content').val(text);
            $("#source_lang").val(split[0]),
            $("#target_lang").val(split[1]),
            $("#translation_result").val(event.detail.to);


        }
    },
    /**
     * Event handles translation form submit action
     */
    submit: {
        type: "TranslateFormSubmit",
        event: new CustomEvent(
            "TranslateFormSubmit",
            {
                detail: {
                    message: "Request for translation was triggered."
                },
                bubbles: true,
                cancelable: true
            }
        ),
        handler: function(event) {
            var payload = $("#translation_content").val(),
                source = $("#source_lang").val(),
                target = $("#target_lang").val(),
                submit_btn = $('#submit_button'),
                finishProgress = function() {
                    submit_btn.removeClass('btn-danger').text("Translate");
                };

            //clear notifications
            document.dispatchEvent(APP.events.notificationRemove.event());
            //init procedure
            submit_btn.addClass('btn-danger').text("Translating...");

            try {
                APP.apertiumClient.translate(payload, source, target, function(response) {
                    try {
                        if (response.error) {
                            throw new APP.exception.TranslationError(response.error.code, response.error.message);
                        }
                        $("#translation_result").val(response.translation);
                        document.dispatchEvent(APP.events.storageAdd.event(payload, response.translation, source, target));
                        finishProgress();
                    }catch (e) {
                        document.dispatchEvent(APP.events.notification.event(e.toString(), "error"));
                        console.log(e.message);
                        finishProgress();
                    }
                });
            } catch (e) {
                document.dispatchEvent(APP.events.notification.event(e.toString(), "error"));
                finishProgress();
            }
        }
    }
}