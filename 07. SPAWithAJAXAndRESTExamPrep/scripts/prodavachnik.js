function startApp() {
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkCreateAd').click(showCreateAdView);
    $('#linkLogout').click(logoutUser);
    $('#linkListAds').click(getAds);

    $('#buttonRegisterUser').click(registerUser);
    $('#buttonLoginUser').click(loginUser);
    $('#buttonCreateAd').click(createAd);
    $('#buttonEditAd').click(editAd);

    const appId = 'kid_Sk5siCKMe';
    const appSecret = '82c5a2314f684c50bab7ee297b6b1060';
    const baseURL = 'https://baas.kinvey.com/';
    const basicAuthorization = 'Basic ' + btoa(appId + ':' + appSecret);
    const headers = {
        'Authorization': basicAuthorization,
        'Content-Type': 'application/json'
    };

    function getAdAtStartUp(func) {
        let id = sessionStorage.getItem('adId');

        $.ajax({
            method: "GET",
            headers: authenticationTokenHeader(),
            url: baseURL + `appdata/${appId}/ads/` + id
        })
            .then(function(ad) { func(ad) })
            .catch(handleAjaxError);
    }

    let currentView = sessionStorage.getItem('view');

    if (currentView) {
        showView(currentView);
        showHideMenuItems();

        switch (currentView) {
            case 'viewAds':
                getAds();
                break;
            case 'viewEditAd':
                getAdAtStartUp(function(ad) {
                    editAdGetInfo(ad._id);
                });
                break;
            case 'viewDetailsAd':
                getAdAtStartUp(function(ad) {
                    readMore(ad);
                });
                break;
        }
    } else {
        showView('viewHome');
        showHideMenuItems();
    }

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    function showView(view) {
        $('main > section').hide();
        $('#' + view).show();
    }

    function showHideMenuItems() {
        $('#linkHome').show();
        if (sessionStorage.getItem('authToken')) {
            $('#linkLogin').hide();
            $('#linkRegister').hide();
            $('#linkListAds').show();
            $('#linkCreateAd').show();
            $('#linkLogout').show();
        } else {
            $('#linkLogin').show();
            $('#linkRegister').show();
            $('#linkListAds').hide();
            $('#linkCreateAd').hide();
            $('#linkLogout').hide();
        }
    }

    function showHomeView() {
        showView('viewHome');
        showHideMenuItems();
        setView('viewHome');
        isLoggedIn();
    }

    function showLoginView() {
        $('#formEditAd').trigger('reset');
        showView('viewLogin');
        setView('viewLogin');
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
        setView('viewRegister');
    }

    function showEditView() {
        $('#formRegister').trigger('reset');
        showView('viewEditAd');
        setView('viewEditAd');
        isLoggedIn();
    }

    function showAdsView() {
        setView('viewAds');
        showView('viewAds');
        isLoggedIn();
    }

    function showCreateAdView() {
        showView('viewCreateAd');
        setView('viewCreateAd');
        isLoggedIn();
    }

    function registerUser() {
        let registerUserData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };

        let registerUserRequest = {
            method: "POST",
            headers: headers,
            data: JSON.stringify(registerUserData),
            url: baseURL + `user/${appId}`
        };

        $.ajax(registerUserRequest)
            .then(registerSuccess)
            .catch(handleAjaxError);
        
        function registerSuccess() {
            showInfo('User registered successfully. Please login!');
            showView('viewLogin');
        }
    }

    function loginUser() {
        let loginUserData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };

        let loginUserRequest = {
            method: "POST",
            headers: headers,
            data: JSON.stringify(loginUserData),
            url: baseURL + `user/${appId}/login`
        };

        $.ajax(loginUserRequest)
            .then(loginSuccess)
            .catch(handleAjaxError);

        function loginSuccess(loggedUser) {
            saveAuthenticationInformation(loggedUser);
            showInfo('Logged in successfully.');
            showHideMenuItems();
            setView('viewAds');
            getAds();
        }

        function saveAuthenticationInformation(loggedUser) {
            sessionStorage.setItem('authToken', loggedUser._kmd.authtoken);
            sessionStorage.setItem('id', loggedUser._id);
            sessionStorage.setItem('username', loggedUser.username);
        }
    }
    
    function logoutUser() {
        let logoutRequest = {
            method: "POST",
            headers: authenticationTokenHeader(),
            url: baseURL + `user/${appId}/_logout`
        };

        $.ajax(logoutRequest)
            .then(logoutSuccess)
            .catch(handleAjaxError);

        function logoutSuccess() {
            showInfo('Logged out successfully.');
            sessionStorage.clear();
            showHideMenuItems();
            showView('viewHome');
        }
    }

    function authenticationTokenHeader() {
        return {
            'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken'),
            'Content-Type': 'application/json'
        }
    }

    function getAds() {
        let adRequest = {
            method: "GET",
            headers: authenticationTokenHeader(),
            url: baseURL + `appdata/${appId}/ads`
        };

        $.ajax(adRequest)
            .then(listAds)
            .catch(handleAjaxError);

        function listAds(ads) {
            $('#ads').empty();
            showAdsView();

            if (ads.length == 0) {
                let p = $('<p>').text('No advertisements available.').css('text-align', 'center');
                $('#ads').append(p);
            } else {
                let table = $(
                    `<table>
                        <tr>
                            <th>Title</th>
                            <th>Publisher</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Date Published</th>
                            <th>Actions</th>
                        </tr>
                    </table>`);

                for (let ad of ads) {
                    let links = [];

                    if (sessionStorage.getItem('username') === ad.publisher &&
                        sessionStorage.getItem('id') === ad._acl.creator) {

                        let deleteLink = $('<a href="#">[Delete]</a>').click(function() {deleteAd(ad._id)});
                        let editLink = $('<a href="#">[Edit]</a>').click(function() {editAdGetInfo(ad._id)});

                        links.push(deleteLink);
                        links.push(" ");
                        links.push(editLink);
                        links.push(" ");
                    }

                    let readMoreLink = $('<a href="#">[Read More]</a>').click(function() {readMore(ad)});

                    let tr = $('<tr>').attr('data-id', ad._acl.creator);
                    tr.append(
                        $('<td>').text(ad.title),
                        $('<td>').text(ad.publisher),
                        $('<td>').text(ad.description),
                        $('<td>').text(ad.price),
                        $('<td>').text(ad.date),
                        $('<td>').append(links).append(readMoreLink)
                    );

                    table.append(tr);
                }

                table.appendTo($('#ads'));
            }
        }
    }

    function createAd() {
        showCreateAdView();

        let title = $('#formCreateAd input[name=title]').val();
        let publisher = sessionStorage.getItem('username');
        let description = $('#formCreateAd textarea[name=description]').val();
        let date = $('#formCreateAd input[name=datePublished]').val();
        let priceAsText = $('#formCreateAd input[name=price]').val()
        let price = Number(priceAsText);
        let image = $('#formCreateAd input[name=image]').val();

        if (!isEmpty([title, description, date, image]) && !isNaN(price) && priceAsText !== '' && price >= 0) {
            let newAdData = {
                title: title,
                publisher: publisher,
                description: description,
                date: date,
                price: price,
                image: image
            };

            let adRequest = {
                method: "POST",
                url: baseURL + `appdata/${appId}/ads`,
                headers: authenticationTokenHeader(),
                data: JSON.stringify(newAdData)
            };

            $.ajax(adRequest)
                .then(createAdSuccess)
                .catch(handleAjaxError);
        } else {
            showError('Please correct the input data.');
        }

        function createAdSuccess() {
            $('#formCreateAd').trigger('reset');
            showInfo('New ad created successfully.');
            showAdsView();
            getAds();
        }
    }

    function deleteAd(id) {
        let adDeleteRequest = {
            method: "DELETE",
            url: baseURL + `appdata/${appId}/ads/${id}`,
            headers: authenticationTokenHeader()
        };

        $.ajax(adDeleteRequest)
            .then(adDeleteSuccess)
            .catch(handleAjaxError);

        function adDeleteSuccess() {
            showInfo('Ad deleted successfully.');
            showAdsView();
            getAds();
        }
    }

    function editAdGetInfo(id) {
        let adRequest = {
            method: "GET",
            headers: authenticationTokenHeader(),
            url: baseURL + `appdata/${appId}/ads/${id}`
        };

        $.ajax(adRequest)
            .then(fillEditData)
            .catch(handleAjaxError);

        function fillEditData(ad) {
            showEditView();
            sessionStorage.setItem('adId', ad._id);

            $('#formEditAd input[name=title]').val(ad.title);
            $('#formEditAd textarea[name=description]').val(ad.description);
            $('#formEditAd input[name=datePublished]').val(ad.date);
            $('#formEditAd input[name=price]').val(ad.price);
            $('#formEditAd input[name=image]').val(ad.image);

            $('#formEditAd input[name=id]').val(ad._id);
            $('#formEditAd input[name=publisher]').val(ad.publisher);
        }
    }

    function editAd() {
        let title = $('#formEditAd input[name=title]').val();
        let description = $('#formEditAd textarea[name=description]').val();
        let date = $('#formEditAd input[name=datePublished]').val();
        let priceAsText = $('#formEditAd input[name=price]').val();
        let price = Number(priceAsText);
        let image = $('#formEditAd input[name=image]').val();

        let publisher = $('#formEditAd input[name=publisher]').val();
        let id = $('#formEditAd input[name=id]').val();

        if (!isEmpty([title, description, date]) && !isNaN(price) && priceAsText !== '' && price >= 0) {
            let editAdData = {
                title: title,
                publisher: publisher,
                description: description,
                date: date,
                price: price,
                image: image
            };

            let editRequest = {
                method: "PUT",
                url: baseURL + `appdata/${appId}/ads/${id}`,
                headers: authenticationTokenHeader(),
                data: JSON.stringify(editAdData)
            };

            $.ajax(editRequest)
                .then(editAdSuccess)
                .catch(handleAjaxError);
        } else {
            showError('Please correct the input data.');
        }

        function editAdSuccess() {
            showInfo('Ad edited successfully.');
            showAdsView();
            getAds();
        }
    }

    function readMore(ad) {
        $('#viewDetailsAd').empty();
        setView('viewDetailsAd');
        sessionStorage.setItem('adId', ad._id);

        let html = $('<div>').append(
            $('<br>'),
            $('<img>').attr('src', ad.image),
            $('<br>'),
            $('<label>').text('Title:'),
            $('<h1>').text(ad.title),
            $('<label>').text('Description: '),
            $('<p>').text(ad.description),
            $('<label>').text('Publisher: '),
            $('<div>').text(ad.publisher),
            $('<label>').text('Date: '),
            $('<div>').text(ad.date),
            $('<label>').text("Price: "),
            $('<p>').text(ad.price)
        );

        $('#viewDetailsAd').append(html);
        showView('viewDetailsAd');
    }
    
    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }

    function showInfo(text) {
        $('#infoBox').text(text);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);

    }

    function setView(view) {
        sessionStorage.setItem('view', view);
    }

    function isEmpty(items) {
        for (let item of items) {
            if (item === '')
                return true;
        }

        return false;
    }

    function isLoggedIn() {
        if (sessionStorage.getItem('username')) {
            $('#loggedInUser').show().text('Logged in as: ' + sessionStorage.getItem('username'));
        }
    }
}