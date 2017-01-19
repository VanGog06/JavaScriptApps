function attachEvents() {
    const url = 'https://messenger-25786.firebaseio.com/messenger.json';

    $('#refresh').click(refreshMessages);
    $('#submit').click(submitMessages);

    function refreshMessages() {
        let request = {
            method: "GET",
            url: url,
            success: displayMessages
        };

        $.ajax(request);
    }

    function submitMessages() {
        let author = $('#author').val();
        let content = $('#content').val();
        let timestamp = Date.now();

        let message = {author: author, content: content, timestamp: timestamp};

        let request = {
            method: "POST",
            url: url,
            data: JSON.stringify(message),
        };

        $.ajax(request);
    }

    function displayMessages(textData) {
        $('#messages').empty();

        for (let key of Object.keys(textData)) {
            let newText = `${textData[key].author}: ${textData[key].content}\n`;
            let currentText = $('#messages').text();
            $('#messages').text(currentText + newText);
        }
    }
}