function solve() {
    let currentStop = 'depot';

    function depart() {
        let url = "https://judgetests.firebaseio.com/schedule/" + currentStop + ".json";
        let request = {
            method: "GET",
            url: url,
            success: function(data) {
                $('.info').text(`Next stop ${data.name}`);
                toggleButtons('#arrive', '#depart');
            },
            error: function(err) {
                $('.info').text(`Error`);
                disableButton();
            }
        };

        $.ajax(request);
    }

    function arrive() {
        let url = "https://judgetests.firebaseio.com/schedule/" + currentStop + ".json";
        let request = {
            method: "GET",
            url: url,
            success: function(data) {
                $('.info').text(`Arriving at ${data.name}`);
                toggleButtons('#depart', '#arrive');
                currentStop = data.next;
            },
            error: function(err) {
                $('.info').text(`Error`);
                disableButton();
            }
        };

        $.ajax(request);
    }

    function disableButton() {
        $('#depart').attr('disabled', true);
        $('#arrive').attr('disabled', true);
    }

    function toggleButtons(firstButton, secondButton) {
        $(firstButton).removeAttr('disabled');
        $(secondButton).attr('disabled', true);
    }

    return {
        depart,
        arrive
    };
}
let result = solve();