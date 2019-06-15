import React, { Component } from 'react';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import './styles/NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      addDropdownIsOpen: false
    };
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  forceCollapseNavbar = () => {
    this.setState({
      collapsed: true
    });
  };

  toggleProductsDropdown = () => {
    this.setState({
      addDropdownIsOpen: !this.state.addDropdownIsOpen
    });
  };

  render() {
    const bgColor = {
      'bg-dark': this.props.darkMode,
      'bg-light': !this.props.darkMode
    };

    const btnColor = {
      dark: this.props.darkMode,
      light: !this.props.darkMode
    };

    return (
      <header>
        <Navbar
          className={classnames(
            'navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow',
            bgColor
          )}
          light={!this.props.darkMode}
          dark={this.props.darkMode}
        >
          <Container>
            <NavbarBrand tag={Link} to="/">
              Salary control
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={!this.state.collapsed}
              navbar
            >
              <Nav className="navbar-nav flex-grow" navbar>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/"
                    active={window.location.pathname === '/'}
                    onClick={this.forceCollapseNavbar}
                  >
                    Home
                  </NavLink>
                </NavItem>
                <Dropdown
                  nav
                  isOpen={this.state.addDropdownIsOpen}
                  toggle={this.toggleProductsDropdown}
                  group
                >
                  <NavLink
                    tag={Link}
                    to="/new"
                    active={window.location.pathname.includes('/new')}
                    onClick={this.forceCollapseNavbar}
                  >
                    Agregar
                  </NavLink>
                  <DropdownToggle nav caret className="dropdown-toggle-split" />
                  <DropdownMenu right>
                    <DropdownItem tag={Link} to="/new" onClick={this.forceCollapseNavbar}>
                      Agregar pago
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/new/special" onClick={this.forceCollapseNavbar}>
                      Agregar pago especial
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/new/discount" onClick={this.forceCollapseNavbar}>
                      Agregar descuento recurrente
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/discounts"
                    active={window.location.pathname.includes('/discounts')}
                    onClick={this.forceCollapseNavbar}
                  >
                    Descuentos
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/reports"
                    active={window.location.pathname.includes('/reports')}
                    onClick={this.forceCollapseNavbar}
                  >
                    Reportes
                  </NavLink>
                </NavItem>
                <NavItem>
                  <Button color={classnames(btnColor)} onClick={this.props.toggleDarkMode}>
                    <FontAwesomeIcon icon="adjust" />
                  </Button>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
