function solve() {
    let url = "https://baas.kinvey.com/appdata/kid_BJe588Szx/football-matches";
    let headers = {
        "Authorization": "Basic Z3Vlc3Q6Z3Vlc3Q=",
        "Content-Type": "application/json"
    };

    let myBets = [];

    class AppView extends React.Component {
        render() {
            return React.createElement(
                "div",
                { className: "wrapper" },
                React.createElement(HeaderView, null),
                React.createElement(ButtonHolder, null),
                React.createElement(ContentHolder, null)
            );
        }
    }

    class HeaderView extends React.Component {
        render() {
            return React.createElement(
                "header",
                null,
                React.createElement(
                    "div",
                    null,
                    "Dollar Football"
                )
            );
        }
    }

    class ButtonHolder extends React.Component {
        render() {
            return React.createElement(
                "div",
                { className: "button-holder" },
                React.createElement(
                    "button",
                    { className: "button", onClick: this.showBets },
                    "My Bets"
                ),
                React.createElement(
                    "button",
                    { className: "button", onClick: this.showMatches },
                    "Matches"
                )
            );
        }

        showBets() {
            ReactDOM.render(React.createElement(BetsView, { bets: myBets }), $('.content-holder')[0]);
        }

        showMatches() {
            $.ajax({
                method: 'GET',
                url: url,
                headers: headers,
                success: function (success) {
                    success = success.sort(function (elem1, elem2) {
                        let time1 = elem1.time.split(" ")[0];
                        let format1 = elem1.time.split(" ")[1];

                        let time2 = elem2.time.split(" ")[0];
                        let format2 = elem2.time.split(" ")[1];

                        let hour1 = Number(time1.split(":")[0]);
                        let minutes1 = Number(time1.split(":")[1]);

                        let hour2 = Number(time2.split(":")[0]);
                        let minutes2 = Number(time2.split(":")[1]);

                        let result = format1.localeCompare(format2);

                        if (result == 0) {
                            result = hour1 - hour2;
                        }

                        if (result == 0) {
                            result = minutes1 - minutes2;
                        }

                        return result;
                    });

                    ReactDOM.render(React.createElement(MatchesView, { matches: success }), $('.content-holder')[0]);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }

    class BetsView extends React.Component {
        render() {
            return React.createElement(
                "table",
                null,
                React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            null,
                            "Home Team"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Away Team"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Start"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Bet On"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Ratio"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Value"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Estimated Winnings"
                        )
                    ),
                    this.props.bets.forEach(function (bet, index) {
                        return React.createElement(
                            "tr",
                            { key: index },
                            React.createElement(
                                "td",
                                null,
                                bet.homeTeam
                            ),
                            React.createElement(
                                "td",
                                null,
                                bet.awayTeam
                            ),
                            React.createElement(
                                "td",
                                null,
                                bet.time
                            ),
                            React.createElement(
                                "td",
                                null,
                                bet.betType
                            ),
                            React.createElement(
                                "td",
                                null,
                                bet.betRatio
                            ),
                            React.createElement(
                                "td",
                                null,
                                bet.betValue
                            ),
                            React.createElement(
                                "td",
                                null,
                                bet.estimatedWin
                            )
                        );
                    })
                )
            );
        }
    }

    class MatchesView extends React.Component {
        constructor(props) {
            super(props);
            this.handleBet = this.handleBet.bind(this);
        }

        render() {
            let _that = this;

            return React.createElement(
                "table",
                null,
                React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            null,
                            "Id"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Home Team"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Away Team"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Start"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Win"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Draw"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Lose"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Bet"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Bet On"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Submit"
                        )
                    ),
                    this.props.matches.map(function (match, index) {
                        let hasBet = false;

                        myBets.forEach(function (myBet) {
                            if (myBet.id == match.id) {
                                hasBet = true;
                            }
                        });

                        return React.createElement(
                            "tr",
                            { key: index },
                            React.createElement(
                                "td",
                                { id: "match-" + match.id },
                                match.id
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-home" },
                                match.home
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-away" },
                                match.away
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-time" },
                                match.time
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-win" },
                                match.ratio["1"]
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-draw" },
                                match.ratio["x"]
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-lose" },
                                match.ratio["2"]
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-bet" },
                                hasBet == true ? React.createElement("input", { type: "number", min: "1", max: "1000000", disabled: true }) : React.createElement("input", { type: "number", min: "1", max: "1000000" })
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-bet-type" },
                                hasBet == true ? React.createElement("select", { disabled: true }) : React.createElement(
                                    "select",
                                    null,
                                    React.createElement(
                                        "option",
                                        null,
                                        "Win"
                                    ),
                                    React.createElement(
                                        "option",
                                        null,
                                        "Draw"
                                    ),
                                    React.createElement(
                                        "option",
                                        null,
                                        "Lose"
                                    )
                                )
                            ),
                            React.createElement(
                                "td",
                                { id: "match-" + match.id + "-button" },
                                hasBet == true ? React.createElement(
                                    "button",
                                    { disabled: true },
                                    "Bet"
                                ) : React.createElement(
                                    "button",
                                    { onClick: _that.handleBet },
                                    "Bet"
                                )
                            )
                        );
                    })
                )
            );
        }

        handleBet(event) {
            let currentId = Number($(event.target).parent().attr('id').replace('match-', '').replace('-button', ''));
            let value = Number($('#match-' + currentId + '-bet input').val());
            $('#match-' + currentId + '-bet input').val('');
            let betType = $('#match-' + currentId + '-bet-type select option:selected').text().toString().toLowerCase();

            let ratio = Number($('#match-' + currentId + '-' + betType).text());

            let homeTeam = $('#match-' + currentId + '-home').text();
            let awayTeam = $('#match-' + currentId + '-away').text();
            let time = $('#match-' + currentId + '-time').text();

            let bet = {
                id: currentId,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                time: time,
                betType: betType,
                betRatio: ratio,
                betValue: value,
                estimatedWin: (ratio * value).toFixed(2)
            };

            myBets.push(bet);

            let myMatches = this.props.matches;

            ReactDOM.render(React.createElement(MatchesView, { matches: myMatches }), $('.content-holder')[0]);
        }
    }

    class ContentHolder extends React.Component {
        render() {
            return React.createElement("div", { className: "content-holder" });
        }
    }

    return {
        AppView,
        HeaderView,
        ButtonHolder,
        ContentHolder
    };
}

let components = solve();

ReactDOM.render(React.createElement(components.AppView, null), $('.app')[0]);
//# sourceMappingURL=script_reactjs.js.map