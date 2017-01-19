function listTowns(selector) {
    class Form extends React.Component {
        constructor(props) {
            super(props);
            this.handleOnSubmit = this.handleOnSubmit.bind(this);
        }

        handleOnSubmit(event) {
            event.preventDefault();
            this.props.onSubmit(event.target.parentNode[0]);
        }

        render() {
            return React.createElement(
                "form",
                null,
                React.createElement("input", { type: "text" }),
                React.createElement("input", { type: "submit", value: "Submit", onClick: this.handleOnSubmit })
            );
        }
    }

    class App extends React.Component {
        constructor(props) {
            super(props);
            this.state = { towns: [] };

            this.handleOnSubmit = this.handleOnSubmit.bind(this);
        }

        handleOnSubmit(input) {
            if (input.value.length == 0) {
                this.setState({ towns: [] });
            } else {
                this.setState({ towns: input.value.split(', ') });
            }
        }

        render() {
            let towns = this.state.towns.map(function (town, index) {
                return React.createElement(
                    "li",
                    { key: index },
                    town
                );
            });

            return React.createElement(
                "div",
                null,
                React.createElement(Form, { onSubmit: this.handleOnSubmit }),
                React.createElement(
                    "ul",
                    null,
                    towns
                )
            );
        }
    }

    ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
}
//# sourceMappingURL=script.js.map