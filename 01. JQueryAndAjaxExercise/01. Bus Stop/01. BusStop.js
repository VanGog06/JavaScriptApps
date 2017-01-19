function getInfo() {
    let url = "https://judgetests.firebaseio.com/businfo/" + $('#stopId').val() + ".json";

    let request = {
        method: "GET",
        url: url,
        dataType: 'json',
        success: displayBuses,
        error: displayError
    };

    $.ajax(request);

    function displayBuses(stop) {
        $('#stopName').empty();
        $('#buses').empty();

        $('#stopName').text(stop.name);
        for (let key of Object.keys(stop.buses)) {
            let newBus = $('<li>').text(`Bus ${key} arrives in ${stop.buses[key]} minutes`);
            $('#buses').append(newBus);
        }
    }

    function displayError() {
        $('#stopName').empty();
        $('#buses').empty();

        $('#stopName').text("Error");
    }
}