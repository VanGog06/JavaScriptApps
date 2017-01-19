let appId = 'kid_BJXTsSi-e';
let appSecret = '447b8e7046f048039d95610c1b039390';
let authorization = 'Basic ' + btoa('guest:guest');
let baseURL = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock';

console.log('Knock Knock.');

$.ajax({
    method: "GET",
    url: baseURL + '?query=Knock Knock.',
    headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
    },
    success: function(data) {
        console.log(data.answer);
        console.log(data.message);

        $.ajax({
            method: "GET",
            url: baseURL + '?query=' + data.message,
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            },
            success: function(data2) {
                console.log(data2.answer);
                console.log(data2.message);

                $.ajax({
                    method: "GET",
                    url: baseURL + '?query=' + data2.message,
                    headers: {
                        'Authorization': authorization,
                        'Content-Type': 'application/json'
                    },
                    success: function(data3) {
                        console.log(data3.answer);
                    },
                    error: function(error3) {
                        console.log(error3);
                    }
                });
            },
            error: function(error2) {
                console.log(error2);
            }
        });
    },
    error: function(error) {
        console.log(error);
    }
});