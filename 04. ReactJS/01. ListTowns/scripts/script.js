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
            return (
                <form>
                    <input type="text"/>
                    <input type="submit" value="Submit" onClick={this.handleOnSubmit} />
                </form>
            );
        }
    }

    class App extends React.Component {
        constructor(props) {
            super(props);
            this.state = {towns: []};

            this.handleOnSubmit = this.handleOnSubmit.bind(this);
        }

        handleOnSubmit(input) {
            if (input.value.length == 0) {
                this.setState({towns: []});
            } else {
                this.setState({towns: input.value.split(', ')});
            }
        }

        render() {
            let towns = this.state.towns.map(function(town, index) {
                return <li key={index}>{town}</li>;
            });

            return (
                <div>
                    <Form onSubmit={this.handleOnSubmit}/>
                    <ul>{towns}</ul>
                </div>
            );
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
}