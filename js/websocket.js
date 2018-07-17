(function($){
$.extend({
    websocketSettings: {
        open: function(){},
        close: function(){},
        message: function(){},
        options: {},
        events: {}
    },
    websocket: function(url, s) {
        var ws = WebSocket ? new WebSocket( url ) : {
            send: function(m){ return false },
            close: function(){}
        };
        ws._settings = $.extend($.websocketSettings, s);
        $(ws)
            .bind('open', $.websocketSettings.open)
            .bind('close', $.websocketSettings.close)
            .bind('message', $.websocketSettings.message)
            .bind('message', function(e){
                //var m = $.evalJSON(e.originalEvent.data);
                var m = eval("(" + (e.originalEvent.data) + ")");
                var h = $.websocketSettings.events[m.cmd];
                if (h) h.call(this, m);
            });
        //ws._settings = $.extend($.websocketSettings, s);
        ws._send = ws.send;
        ws.send = function(cmd, data) {
            var m = { cmd: cmd };
            m = $.extend(true, m, $.extend(true, {}, $.websocketSettings.options, m));
            if (data) m['data'] = data;
            //return this._send($.toJSON(m));
            var str = 'CMD ' + JSON.stringify(m);
            return this._send(str);
        }
        $(window).unload(function(){ ws.close(); ws = null });
        return ws;
    }
});
})(jQuery);