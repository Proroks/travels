var core = {
    itemNum: {},
    ajaxQuery: function (url, input, type_result, preloader, callback, fail_callback, parameters, ajax_parameters, ignoreSync) {
        type_result = type_result || 'json';
        preloader = preloader || true;
        callback = callback || false;
        fail_callback = fail_callback || false;
        parameters = parameters || false;
        ajax_parameters = ajax_parameters || false;
        ignoreSync = ignoreSync || false;

        var random_id = 'loader' + parseInt(Math.random() * 1000000000);
        var current_id = this.setCurrentItemNum(url);

        if (preloader == true)
            window.core.preloaderStart(random_id);

        var ajax_object = {
            type: "POST",
            url: url,
            data: input,
            async: ((callback == false) ? false : true),

            beforeSend: function () {
                //
            },
            complete: function (answer) {
                if (callback && (current_id == window.core.getCurrentItemNum(url) || ignoreSync)){
                    //console.log(typeof( callback ));
                    if ('string' == typeof( callback ))
                        window['callbacks'][callback](answer, parameters);
                    
                    if ('function' == typeof( callback ))
                        callback(answer, parameters);
                }

                window.core.preloaderStop(random_id);
            },
            fail: function (answer) {
                if (fail_callback)
                    window['callbacks'][fail_callback](answer, parameters);
                window.core.preloaderStop(random_id);
            },
            error: function (answer) {
                if (fail_callback)
                    window['callbacks'][fail_callback](answer, parameters);
                window.core.preloaderStop(random_id);
            }
        };

        if (ajax_parameters)
            $.each(ajax_parameters, function(k,v){
                ajax_object[k] = v;
            });

        var result = $.ajax(ajax_object);

        if (type_result == 'json') {
            try {
                return JSON.parse(result.responseText);
            } catch (e) {
                return false;
            }
        }
        else
            return result.responseText;
    },
    preloaderStart: function (random_id) {
        //$('.preloader-container').append('<div class="preloader-block" id="' + random_id + '">' + $('#preloader-block-source').html() + '</div>');
    },
    preloaderStop: function (random_id) {
        //$('#' + random_id).remove();
    },
    setCurrentItemNum: function(url){
        var new_current_num = this.getCurrentItemNum(url) + 1;
        this.itemNum[url] = new_current_num;

        return new_current_num;
    },
    getCurrentItemNum:  function(url){
        var current_num = (typeof this.itemNum[url] != 'undefined' ? this.itemNum[url] : 0);

        return current_num;
    },
    setCookie: function (name, value, expires, path, domain, secure) {
        var expires = expires || 32140800;
        var path = path || '/';

        expires instanceof Date ? expires = expires.toGMTString() : typeof(expires) == 'number' && (expires = (new Date(+(new Date) + expires * 1e3)).toGMTString());
        var r = [name + "=" + escape(value)], s, i;
        for (i in s = {expires: expires, path: path, domain: domain}) {
            s[i] && r.push(i + "=" + s[i]);
        }
        return secure && r.push("secure"), document.cookie = r.join(";"), true;
    },
    getCookie: function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");

        if (parts.length == 2)
            return parts.pop().split(";").shift();
        else
            return false;
    },
    rangeValueInReadable: function(num, is_metrical) {
        var is_metrical = is_metrical || false;
        var value = num;

        if (num == 0) value = 50;
        else if (num > 0 && num <= 9) value = (num * 100);
        else if (num > 9 && num <= 19) value = (num - 9);
        else if (num > 19 && num <= 28) value = ((num - 18) * 10);
        else if (num > 28 && num <= 37) value = ((num - 27) * 100);

        if (is_metrical) {
            if (num <= 9)
                value = value + ' м';
            else
                value = value + ' км';
        } else {
            if (num <= 9)
                value = value / 1000;
        }

        return value;
    },
    plural: function(number, one, two, five) {
        number = Math.abs(number);
        number %= 100;
        if (number >= 5 && number <= 20) {
            return five;
        }
        number %= 10;
        if (number == 1) {
            return one;
        }
        if (number >= 2 && number <= 4) {
            return two;
        }
        return five;
    },
    numberWithSpaces: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    hitCounter: function(name, category, callback) {
        var callback = callback || false;

        if (typeof yaCounter46292802 != 'undefined')
            yaCounter46292802.reachGoal(name);

        if (typeof ga != 'undefined')
            ga('send', 'event', category, name, callback, {
                'transport': 'beacon',
                'hitCallback': callback
            });
    },
    notificationItem: function(title, description, noteStyle, noteWidth, noteDelay, noteStack){
            var noteStyle = noteStyle ? noteStyle : 'primary';
            var noteWidth = noteWidth ? noteWidth : "400px";
            var noteStack = noteStack ? noteStack : "stack_top_right";
            var noteDelay = noteDelay ? noteDelay : 5000;

            // Create new Notification
            /*new PNotify({
                title: title,
                text: description,
                shadow: 'true',
                opacity: 1,
                addclass: noteStack,
                type: noteStyle,
                stack: {
                    "dir1": "down",
                    "dir2": "left",
                    "push": "top",
                    "spacing1": 10,
                    "spacing2": 10
                },
                width: noteWidth,
                delay: noteDelay
            });*/
            alert(description);
    },
    delay: (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })()
}
