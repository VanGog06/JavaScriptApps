function attachEvents() {
    let appId = 'kid_HyamMg8ze';
    let username = 'guest';
    let password = 'guest';
    let authorization = 'Basic ' + btoa(username + ':' + password);
    let headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
    };
    let baseURL = `https://baas.kinvey.com/appdata/${appId}`;

    $('#loadCountries').click(loadCountries);
    $('#addCountry').click(addCountry);
    $('#editCountry').click(editCountry);
    $('#deleteCountry').click(deleteCountry);
    $('#loadTowns').click(loadTowns);
    $('#addTown').click(addTown);
    $('#deleteTown').click(deleteTown);

    function loadCountries() {
        let countriesRequest = {
            method: 'GET',
            headers: headers,
            url: baseURL + '/countries'
        };

        $.ajax(countriesRequest)
            .then(displayCountries)
            .catch(function(error) {
                console.log(error.statusText);
            });
    }

    function displayCountries(countries) {
        let countriesDiv = $('#countries');
        countriesDiv.empty();
        countriesDiv.append('<legend>Countries</legend>');

        for (let country of countries) {
            $('<option>').val(country._id).text(country.name).appendTo('#countries');
        }
    }

    function addCountry() {
        let country = $('#country').val();

        let countryData = {
            name: country
        };

        let countryRequest = {
            method: 'POST',
            headers: headers,
            url: baseURL + '/countries',
            data: JSON.stringify(countryData)
        };

        $.ajax(countryRequest)
            .then(loadCountries)
            .catch(function(error) {
                console.log(error.statusText);
            });
    }

    function editCountry() {
        let selectedCountry = $('#countries option:selected');
        let newCountry = $('#country').val();
        let id = selectedCountry.val();

        let countryData = {
            name: newCountry
        };

        let countryRequest = {
            method: "PUT",
            url: baseURL + '/countries/' + id,
            headers: headers,
            data: JSON.stringify(countryData)
        };

        $.ajax(countryRequest)
            .then(function() {
                selectedCountry.text(newCountry);
            })
            .catch(function(error) {
                console.log(error.statusText);
            });
    }

    function deleteCountry() {
        let selectedCountry = $('#countries option:selected');
        let id = selectedCountry.val();

        let countryRequest = {
            method: "DELETE",
            url: baseURL + '/countries/' + id,
            headers: headers
        };

        $.ajax(countryRequest)
            .then(function() {
                selectedCountry.remove();
            })
            .catch(function(error) {
                console.log(error.statusText);
            });
    }
    
    function loadTowns() {
        let id = $('#countries option:selected').val();

        let countriesRequest = {
            method: 'GET',
            headers: headers,
            url: baseURL + `/towns?query={"country":"${id}"}`
        };

        $.ajax(countriesRequest)
            .then(displayTowns)
            .catch(function(error) {
                console.log(error.statusText);
            });
    }

    function displayTowns(towns) {
        let townsSelect = $('#towns');
        townsSelect.empty();

        for (let town of towns) {
            $('<option>').text(town.name).val(town._id).appendTo(townsSelect);
        }
    }

    function addTown() {
        let id = $('#countries option:selected').val();
        let town = $('#town').val();

        let countriesRequest = {
            method: 'POST',
            headers: headers,
            url: baseURL + '/towns',
            data: JSON.stringify({name: town, country: id})
        };

        $.ajax(countriesRequest)
            .then(loadTowns)
            .catch(function(error) {
                console.log(error.statusText);
            });
    }

    function deleteTown() {
        let id = $('#towns option:selected').val();

        let countriesRequest = {
            method: 'DELETE',
            headers: headers,
            url: baseURL + `/towns/${id}`
        };

        $.ajax(countriesRequest)
            .then(function() {
                $('#towns option:selected').remove();
                loadTowns();
            })
            .catch(function(error) {
                console.log(error.statusText);
            });
    }
}