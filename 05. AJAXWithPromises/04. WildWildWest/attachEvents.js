function attachEvents() {
    const appId = 'kid_HJzTHfDzl';
    const username = 'guest';
    const password = 'guest';
    const authorization = 'Basic ' + btoa(username + ':' + password);
    const headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
    };
    const baseURL = `https://baas.kinvey.com/appdata/${appId}/players`;

    $('#addPlayer').click(addPlayer);
    $('#save').click(savePlayer);
    $('#reload').click(reload);

    function loadPlayers(activePlayer) {
        let playersRequest = {
            method: "GET",
            url: baseURL,
            headers: headers
        };

        $.ajax(playersRequest)
            .then(function(players) {
                displayPlayers(players);
                setActive(activePlayer);
            })
            .catch(displayError);
    }

    loadPlayers();

    function displayPlayers(players) {
        $('#players').empty();

        for (let player of players) {
            let mainDiv = $('<div>').addClass('player').attr('data-id', player._id);

            let firstRow = $('<div>').addClass('row');
            let secondRow = $('<div>').addClass('row');
            let thirdRow = $('<div>').addClass('row');

            $('<label>Name:</label>').appendTo(firstRow);
            $('<label>').addClass('name').text(player.name).appendTo(firstRow);

            mainDiv.append(firstRow);

            $('<label>Money:</label>').appendTo(secondRow);
            $('<label>').addClass('money').text(player.money).appendTo(secondRow);

            mainDiv.append(secondRow);

            $('<label>Bullets:</label>').appendTo(thirdRow);
            $('<label>').addClass('bullets').text(player.bullets).appendTo(thirdRow);

            mainDiv.append(thirdRow);

            $('<button>').addClass('play').text('Play').click(play).appendTo(mainDiv);
            $('<button>').addClass('delete').text('Delete').click(deletePlayer).appendTo(mainDiv);

            $('#players').append(mainDiv);
        }
    }

    function displayError(error) {
        $('#players').append(error.statusText);
    }

    function addPlayer() {
        let name = $('#addName').val();

        let playerData = {
            name: name,
            money: 500,
            bullets: 6
        };

        let playerRequest = {
            method: "POST",
            url: baseURL,
            headers: headers,
            data: JSON.stringify(playerData)
        };

        $.ajax(playerRequest)
            .then(loadPlayers)
            .catch(displayError);

        $('#addName').val('');
    }

    function deletePlayer() {
        let id = $(this).parent().attr('data-id');

        let deleteRequest = {
            method: "DELETE",
            url: baseURL + `/${id}`,
            headers: headers
        };

        $.ajax(deleteRequest)
            .then(loadPlayers)
            .catch(displayError)
    }
    
    function play() {
        let parent = $(this).parent();
        $('.player').removeClass('active');
        parent.addClass('active');

        let name = parent.find('.name').text();
        let money = parent.find('.money').text();
        money = Number(money);
        let bullets = parent.find('.bullets').text();
        bullets = Number(bullets);

        let player = {
            name: name,
            money: money,
            bullets: bullets
        };

        savePlayer();

        $('#canvas').show();
        $('#save').show();
        $('#reload').show();

        loadCanvas(player);
    }

    function savePlayer() {
        let activePlayer = $('.active');
        if (activePlayer) {
            let id = activePlayer.attr('data-id');
            let name = activePlayer.find('.name').text();
            let money = activePlayer.find('.money').text();
            money = Number(money);
            let bullets = activePlayer.find('.bullets').text();
            bullets = Number(bullets);

            let activePlayerData = {
                name: name,
                money: money,
                bullets: bullets
            };

            let editRequest = {
                method: "PUT",
                url: baseURL + `/${id}`,
                headers: headers,
                data: JSON.stringify(activePlayerData)
            };

            $.ajax(editRequest)
                .then()
                .catch(displayError);
        }

        $('#canvas').hide();
        $('#save').hide();
        $('#reload').hide();
        clearInterval(canvas.intervalId);
    }
    
    function reload() {
        let activePlayer = $('.active');
        if (activePlayer) {
            let id = activePlayer.attr('data-id');
            let name = activePlayer.find('.name').text();
            let money = activePlayer.find('.money').text();
            money = Number(money) - 60;
            let bullets = 6;

            let reloadPlayerData = {
                name: name,
                money: money,
                bullets: bullets
            };

            let reloadRequest = {
                method: "PUT",
                url: baseURL + `/${id}`,
                headers: headers,
                data: JSON.stringify(reloadPlayerData)
            };

            $.ajax(reloadRequest)
                .then(function() {
                    $('#canvas').hide();
                    $('#save').hide();
                    $('#reload').hide();
                    clearInterval(canvas.intervalId);

                    loadPlayers(activePlayer);
                    $('#canvas').show();
                    $('#save').show();
                    $('#reload').show();
                    loadCanvas(reloadPlayerData);
                })
                .catch(displayError);
        }
    }

    function setActive(active) {
        if (active) {
            let id = $(active).attr('data-id');
            $(`.player[data-id=${id}]`).addClass('active');
        }
    }
}