function attachEvents() {
    const baseURL = "https://baas.kinvey.com/appdata/kid_H1dcTS7Ml/biggestCatches";
    const username = 'guest';
    const password = 'guest';
    const authorization = "Basic " + btoa(username + ':' + password);

    $('.add').click(addFish);
    $('.load').click(loadFish);

    function addFish() {
        let angler = $('#addForm .angler').val();
        let weight = Number($('#addForm .weight').val());
        let species = $('#addForm .species').val();
        let location = $('#addForm .location').val();
        let bait = $('#addForm .bait').val();
        let captureTime = Number($('#addForm .captureTime').val());

        let data = {
            angler: angler,
            weight: weight,
            species: species,
            location: location,
            bait: bait,
            captureTime: captureTime
        };

        let fishRequest = {
            method: "POST",
            data: JSON.stringify(data),
            url: baseURL,
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            },
            success: function() {
                console.log('Fish saved.');
                loadFish();
            },
            error: function(error) {
                console.log(error);
            }
        };

        $.ajax(fishRequest);
    }
    
    function loadFish() {
        $('#catches').empty();

        let getFishRequest = {
            method: "GET",
            url: baseURL,
            headers: {
                'Authorization': authorization,
            },
            success: function(data) {
                for (let fish of data) {
                    let div = $('<div>').addClass('catch').attr('data-id', fish._id);
                    $('<label>Angler</label>').appendTo(div);
                    $('<input type="text" class="angler"/>').val(fish.angler).appendTo(div);
                    $('<label>Weight</label>').appendTo(div);
                    $('<input type="number" class="weight"/>').val(fish.weight).appendTo(div);
                    $('<label>Species</label>').appendTo(div);
                    $('<input type="text" class="species"/>').val(fish.species).appendTo(div);
                    $('<label>Location</label>').appendTo(div);
                    $('<input type="text" class="location"/>').val(fish.location).appendTo(div);
                    $('<label>Bait</label>').appendTo(div);
                    $('<input type="text" class="bait"/>').val(fish.bait).appendTo(div);
                    $('<label>Capture Time</label>').appendTo(div);
                    $('<input type="number" class="captureTime"/>').val(fish.captureTime).appendTo(div);
                    $('<button class="update">Update</button>').click(updateFish).appendTo(div);
                    $('<button class="delete">Delete</button>').click(deleteFish).appendTo(div);

                    div.appendTo($('#catches'));
                }
            },
            error: function(error) {
                console.log(error);
            }
        };

        $.ajax(getFishRequest);
    }
    
    function updateFish() {
        let parent = $(this).parent();
        let id = parent.attr('data-id');

        let angler = parent.find('.angler').val();
        let weight = Number(parent.find('.weight').val());
        let species = parent.find('.species').val();
        let location = parent.find('.location').val();
        let bait = parent.find('.bait').val();
        let captureTime = Number(parent.find('.captureTime').val());

        let data = {
            angler: angler,
            weight: weight,
            species: species,
            location: location,
            bait: bait,
            captureTime: captureTime
        };

        let updateFishRequest = {
            method: "PUT",
            data: JSON.stringify(data),
            url: baseURL + '/' + id,
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'

            },
            success: function() {
                console.log('Fish Updated.');
                loadFish();
            },
            error: function(error) {
                console.log(error);
            }
        };

        $.ajax(updateFishRequest);
    }

    function deleteFish() {
        let parent = $(this).parent();
        let id = parent.attr('data-id');

        let deleteFishRequest = {
            method: "DELETE",
            url: baseURL + '/' + id,
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'

            },
            success: function() {
                parent.remove();
            },
            error: function(error) {
                console.log(error);
            }
        };

        $.ajax(deleteFishRequest);
    }
}