function attachEvents() {
    const currentWeatherUrl = 'https://judgetests.firebaseio.com/locations.json';
    const baseUrl = 'https://judgetests.firebaseio.com/forecast';

    $('#submit').click(getForecast);

    function getForecast() {
        let currentWeatherRequest = {
            method: "GET",
            url: currentWeatherUrl
        };

        $.ajax(currentWeatherRequest)
            .then(displayCurrentWeather)
            .catch(displayError);
    }

    function displayCurrentWeather(weathers) {
        let code = '';
        let currentLocation = $('#location').val();

        for (let weather of weathers) {
            if (weather.name === currentLocation) {
                code = weather.code;
            }
        }

        let todayForecastRequest = $.ajax({
            method: "GET",
            url: baseUrl + `/today/${code}.json`
        });

        let threeDayForecastRequest = $.ajax({
            method: "GET",
            url: baseUrl + `/upcoming/${code}.json`
        });

        Promise.all([todayForecastRequest, threeDayForecastRequest])
            .then(displayFutureForecast)
            .catch(displayError);
    }

    function displayError(error) {
        $('#current').text('Error');
        $('#upcoming').text('Error');
    }

    function displayFutureForecast([todayForecast, threeDayForecast]) {
        let current = $('#current');
        let upcoming = $('#upcoming');

        $('#forecast').show();

        let firstSpan = $('<span>')
            .addClass('condition symbol')
            .html(determineSymbol(todayForecast.forecast.condition));

        let secondSpan = $('<span>')
            .addClass('condition');

        $('<span>').addClass('forecast-data')
            .text(todayForecast.name)
            .appendTo(secondSpan);

        $('<span>')
            .addClass('forecast-data')
            .html(todayForecast.forecast.low + "&#176;/" + todayForecast.forecast.high + "&#176;/")
            .appendTo(secondSpan);

        $('<span>')
            .addClass('forecast-data')
            .text(todayForecast.forecast.condition)
            .appendTo(secondSpan);

        firstSpan.appendTo(current);
        secondSpan.appendTo(current);

        for (let forecast of threeDayForecast.forecast) {
            let newSpan = $('<span>')
                .addClass('upcoming');

            $('<span>')
                .addClass('symbol')
                .html(determineSymbol(forecast.condition))
                .appendTo(newSpan);

            $('<span>')
                .addClass('forecast-data')
                .html(forecast.low + "&#176;/" + forecast.high + "&#176;/")
                .appendTo(newSpan);

            $('<span>')
                .addClass('forecast-data')
                .text(forecast.condition)
                .appendTo(newSpan);

            newSpan.appendTo($(upcoming));
        }
    }

    function determineSymbol(text) {
        switch (text) {
            case 'Sunny':
                return '&#x2600;';
            case 'Partly sunny':
                return '&#x26C5;';
            case 'Overcast':
                return '&#x2601;';
            case 'Rain':
                return '&#x2614;';
        }
    }
}