import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from '../components/NavMenu';
import api from '../utils/api';

export class Layout extends Component {
  static displayName = Layout.name;
  DARK_MODE_CLASS_NAME = 'dark-mode';

  constructor(props) {
    super(props);

    this.state = {
      darkMode: true,
    };
  }

  toggleDarkMode = () => {
    const darkMode = !this.state.darkMode;
    this.setState({ darkMode });
    try {
      api.configuration.update({ darkMode });
    } catch {}
  };

  toggleBodyDarkMode = () => {
    if (this.state.darkMode) {
      document.body.classList.add(this.DARK_MODE_CLASS_NAME);
    } else {
      document.body.classList.remove(this.DARK_MODE_CLASS_NAME);
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    this.toggleBodyDarkMode();
  }

  fetchData = async () => {
    try {
      const response = await api.configuration.read();
      const { darkMode } = response;
      this.setState({ darkMode });
    } catch {
      this.setState({ darkMode: false });
    }
  };

  render() {
    return (
      <>
        <NavMenu toggleDarkMode={this.toggleDarkMode} darkMode={this.state.darkMode} />
        <Container>{this.props.children}</Container>
      </>
    );
  }
}
