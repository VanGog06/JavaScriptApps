function startApp() {
    sessionStorage.clear();

    hideBoxes();

    showHideMenuLinks();

    showView('viewAppHome');

    $('#linkMenuAppHome').click(showHomeView);
    $('#linkMenuLogin').click(showLoginView);
    $('#linkMenuRegister').click(showRegisterView);

    $('#formRegister').submit(registerUser);
    $('#formLogin').submit(loginUser);
    $('#formSendMessage').submit(sendMessage);

    $('#linkMenuLogout').click(logoutUser);
    $('#linkMenuUserHome').click(showLoggedInHomeView);
    $('#linkMenuMyMessages').click(showMyMessages);
    $('#linkMenuArchiveSent').click(showArchivedMessages);
    $('#linkMenuSendMessage').click(getUsers);

    $('#linkUserHomeMyMessages').click(showMyMessages);
    $('#linkUserHomeArchiveSent').click(showArchivedMessages);
    $('#linkUserHomeSendMessage').click(showMessageView);

    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    const appId = 'kid_HyFT3d5ml';
    const appSecret = 'bb0cf85281294bbe9a5cc1f65abd0452';
    const baseUrl = 'https://baas.kinvey.com/';
    const basicAuthorization = 'Basic ' + btoa(appId + ':' + appSecret);
    const basicHeaders = {
        'Authorization': basicAuthorization,
        'Content-Type': 'application/json'
    };

    function showHideMenuLinks() {
        if (sessionStorage.getItem('username') && sessionStorage.getItem('authToken')) {
            $('.anonymous').hide();
            $('.useronly').show();
        } else {
            $('.anonymous').show();
            $('.useronly').hide();
        }
    }

    function hideBoxes() {
        $("#infoBox, #errorBox, #loadingBox").hide();
    }

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    function showView(viewName) {
        $('main > section').hide();
        $('#' + viewName).show();
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

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    function showHomeView() {
        showView('viewAppHome');
        showHideMenuLinks();
    }

    function showLoginView() {
        $('#formLogin').trigger('reset');
        showView('viewLogin');
        showHideMenuLinks();
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
        showHideMenuLinks();
    }

    function showLoggedInHomeView() {
        let user = sessionStorage.getItem('username');
        showView('viewUserHome');
        $('#viewUserHomeHeading').text(`Welcome, ${user}!`);
        $('#spanMenuLoggedInUser').text(`Welcome, ${user}!`);
    }

    function showMessageView() {
        $('#formSendMessage').trigger('reset');
        showView('viewSendMessage');
    }

    function registerUser(event) {
        event.preventDefault();

        let registerUserData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=password]').val(),
            name: $('#formRegister input[name=name]').val()
        };

        let registerUserRequest = {
            method: "POST",
            url: baseUrl + `user/${appId}`,
            headers: basicHeaders,
            data: JSON.stringify(registerUserData)
        };
        
        $.ajax(registerUserRequest)
            .then(registerUserSuccess)
            .catch(handleAjaxError);
        
        function registerUserSuccess(user) {
            saveAuthInSession(user);
            showHideMenuLinks();
            showLoggedInHomeView();
            showInfo('User registration successful.');
        }
    }

    function saveAuthInSession(user) {
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('authToken', user._kmd.authtoken);
        sessionStorage.setItem('name', user.name);
    }

    function loginUser() {
        event.preventDefault();

        let loginUserData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=password]').val()
        };

        let loginUserRequest = {
            method: "POST",
            url: baseUrl + `user/${appId}/login`,
            headers: basicHeaders,
            data: JSON.stringify(loginUserData)
        };

        $.ajax(loginUserRequest)
            .then(loginUserSuccess)
            .catch(handleAjaxError);

        function loginUserSuccess(user) {
            saveAuthInSession(user);
            showHideMenuLinks();
            showLoggedInHomeView();
            showInfo('Login successful.');
        }
    }
    
    function logoutUser() {
        let logoutUserRequest = {
            method: "POST",
            url: baseUrl + `user/${appId}/_logout`,
            headers: kinveyHeaders()
        };

        $.ajax(logoutUserRequest)
            .then(logoutUserSuccess)
            .catch(handleAjaxError);
        
        function logoutUserSuccess() {
            sessionStorage.clear();
            showHomeView();
            showInfo('Logout successful.');
        }
    }
    
    function showMyMessages() {
        $('#myMessages').empty();
        showView('viewMyMessages');

        let recipientUsername = sessionStorage.getItem('username');

        let showMessagesRequest = {
            method: "GET",
            url: baseUrl + `appdata/${appId}/messages?query={"recipient_username":"${recipientUsername}"}`,
            headers: kinveyHeaders()
        };

        $.ajax(showMessagesRequest)
            .then(showMessagesSuccess)
            .catch(handleAjaxError);

        function showMessagesSuccess(messages) {
            let table = $('<table>');
            table.append(`<thead>
                        <tr>
                            <th>From</th>
                            <th>Message</th>
                            <th>Date Received</th>
                        </tr>
                    </thead>`);

            table.append($('<tbody>'));

            for (let message of messages) {
                let tr = $('<tr>');
                tr.append(
                    $('<td>').text(formatSender(message.sender_name ,message.sender_username)),
                    $('<td>').html(message.text),
                    $('<td>').text(formatDate(message._kmd.lmt))
                );
                tr.appendTo(table);
            }

            $('#myMessages').append(table);
        }
    }

    function showArchivedMessages() {
        $('#sentMessages').empty();
        showView('viewArchiveSent');

        let senderUsername = sessionStorage.getItem('username');

        let showArchiveMessagesRequest = {
            method: "GET",
            url: baseUrl + `appdata/${appId}/messages?query={"sender_username":"${senderUsername}"}`,
            headers: kinveyHeaders()
        };

        $.ajax(showArchiveMessagesRequest)
            .then(showArchiveMessagesSuccess)
            .catch(handleAjaxError);

        function showArchiveMessagesSuccess(messages) {
            let table = $('<table>');
            table.append(`<thead>
                    <tr>
                        <th>To</th>
                        <th>Message</th>
                        <th>Date Sent</th>
                        <th>Actions</th>
                    </tr>
                    </thead>`);

            table.append($('<tbody>'));

            messages = messages.sort((a, b) => new Date(b._kmd.lmt) - new Date(a._kmd.lmt));

            for (let message of messages) {
                let tr = $('<tr>');
                tr.append(
                    $('<td>').text(message.recipient_username),
                    $('<td>').html(message.text),
                    $('<td>').text(formatDate(message._kmd.lmt)),
                    $('<td>').append($('<button>').text('Delete').click(function() { deleteMessage(message._id);}))
                );
                tr.appendTo(table);
            }

            $('#sentMessages').append(table);
        }
    }
    
    function deleteMessage(id) {
        let deleteMessageRequest = {
            method: "DELETE",
            url: baseUrl + `appdata/${appId}/messages/${id}`,
            headers: kinveyHeaders()
        };

        $.ajax(deleteMessageRequest)
            .then(deleteMessageSuccess)
            .catch(handleAjaxError);
        
        function deleteMessageSuccess() {
            showInfo('Message deleted.');
            showArchivedMessages();
        }
    }

    function sendMessage(event) {
        event.preventDefault();

        let sendMessageData = {
            sender_username: sessionStorage.getItem('username'),
            sender_name: sessionStorage.getItem('name') ? sessionStorage.getItem('name') : null,
            recipient_username: $('select[name=recipient]').val(),
            text: escapeHtml($('#formSendMessage input[name=text]').val())
        };

        let sendMessageRequest = {
            method: "POST",
            url: baseUrl + `appdata/${appId}/messages`,
            headers: kinveyHeaders(),
            data: JSON.stringify(sendMessageData)
        };

        $.ajax(sendMessageRequest)
            .then(sendMessageSuccess)
            .catch(handleAjaxError);
        
        function sendMessageSuccess() {
            showInfo('Message sent.');
            showArchivedMessages();
        }
    }

    function getUsers() {
        let getUsersRequest = {
            method: "GET",
            url: baseUrl + `user/${appId}`,
            headers: kinveyHeaders()
        };

        $.ajax(getUsersRequest)
            .then(getUsersSuccess)
            .catch(handleAjaxError);

        function getUsersSuccess(users) {
            let select = $('select[name=recipient]');
            select.empty();

            for (let user of users) {
                let name = user.name;
                let username = user.username;

                let option = $('<option>').val(username).text(formatUser(name, username));
                option.appendTo(select);
            }

            showMessageView();
        }
    }

    function formatDate(dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    }

    function formatSender(name, username) {
        if (!name)
            return username;
        else
            return username + ' (' + name + ')';
    }

    function formatUser(name, username) {
        if (!name)
            return username;
        else
            return name + ' (' + username + ')';
    }

    function kinveyHeaders() {
        return {
            'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken'),
            'Content-Type': 'application/json'
        }
    }

    let entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
}