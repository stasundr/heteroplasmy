'use strict';

$(
    setInterval(function() {
        $.post('/refresh', function(data) {
            //if (data) alert(data);
        })
    }, 1000)
);