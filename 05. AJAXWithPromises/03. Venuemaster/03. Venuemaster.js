function attachEvents() {
    const appId = 'kid_BJ_Ke8hZg';
    const username = 'guest';
    const password = 'pass';
    const baseURL = 'https://baas.kinvey.com/';
    const authorization = 'Basic ' + btoa(username + ':' + password);
    const headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
    };

    $('#getVenues').click(getVenues);
    
    function getVenues() {
        $('#venue-info').empty();
        let date = $('#venueDate').val();

        let venueRequest = {
            method: 'POST',
            headers: headers,
            url: baseURL + `rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date}`
        };

        $.ajax(venueRequest)
            .then(displayIds)
            .catch(displayError);
    }

    function displayIds(ids) {
        for (let id of ids) {
            let venuesRequest = {
                method: 'GET',
                headers: headers,
                url: baseURL + `appdata/kid_BJ_Ke8hZg/venues/${id}`
            };

            $.ajax(venuesRequest)
                .then(function(venue) {
                    displayVenues(venue);
                    let info = $('#venue-info').find('input.info');
                    $(info[info.length - 1]).click(moreInfo);

                    let purchase = $('#venue-info').find('input.purchase');
                    $(purchase[purchase.length - 1]).click(purchaseTickets);
                })
                .catch(displayError);
        }
    }

    function displayVenues(venue) {
        let newVenue = `<div class="venue" id="${venue._id}">
  <span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>
  <div class="venue-details" style="display: none;">
    <table>
      <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
      <tr>
        <td class="venue-price">${venue.price} lv</td>
        <td><select class="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select></td>
        <td><input class="purchase" type="button" value="Purchase"></td>
      </tr>
    </table>
    <span class="head">Venue description:</span>
    <p class="description">${venue.description}</p>
    <p class="description">Starting time: ${venue.startingHour}</p>
  </div>
</div>`;

        $('#venue-info').append(newVenue);
    }

    function moreInfo() {
        let parent = $(this).parent().parent();
        parent.parent().find('.venue-details').hide();
        parent.find('.venue-details').show();
    }

    function purchaseTickets() {
        let parent = $(this).parent().parent();
        let name = parent.parent().parent().parent().parent().find('span.venue-name').text();
        let quantity = parent.find('.quantity option:selected').text();
        let price = parent.find('td.venue-price').text().split(' ')[0];
        let total = Number(quantity) * Number(price);
        let id = parent.parent().parent().parent().parent().attr('id');

        $('#venue-info').empty();
        let html = `<span class="head">Confirm purchase</span>
<div class="purchase-info">
  <span>${name}</span>
  <span>${quantity} x ${price}</span>
  <span>Total: ${total} lv</span>
  <input type="button" value="Confirm">
</div>`;

        $('#venue-info').append(html);

        $('#venue-info').find('input').click(function() {
            let confirmRequest = {
                method: "POST",
                headers: headers,
                url: baseURL + `rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${id}&qty=${quantity}`
            };

            $.ajax(confirmRequest)
                .then(confirmedRequest)
                .catch(displayError);
        });
    }

    function displayError(error) {
        console.log(error.statusTest);
    }

    function confirmedRequest(object) {
        $('#venue-info').empty();
        $('#venue-info').html(object.html);
    }
}