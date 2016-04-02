'use strict';

$(
    setInterval(function() {
        $.post('/refresh', function(data) {
            //if (data) alert(data);
        })
    }, 15000)
);