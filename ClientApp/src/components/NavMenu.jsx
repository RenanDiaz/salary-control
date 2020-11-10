import React, { Component } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {
  Button,
  Collapse,
  Container,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomNavbar = styled(Navbar)`
  ${(props) => `
    background-color: #${props.dark ? '212529' : 'f8f9fa'};
  `}
  .navbar-brand {
    white-space: normal;
    text-align: center;
    word-break: break-all;
  }
`;

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      addDropdownIsOpen: false,
    };
  }

  toggleNavbar = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  forceCollapseNavbar = () => {
    this.setState({ collapsed: true });
  };

  toggleProductsDropdown = () => {
    this.setState({ addDropdownIsOpen: !this.state.addDropdownIsOpen });
  };

  isCurrentPath = (path) => window.location.pathname === path;

  includesCurrentPath = (path) => window.location.pathname.includes(path);

  render() {
    const { darkMode } = this.props;
    const { collapsed, addDropdownIsOpen } = this.state;
    const btnColor = {
      dark: darkMode,
      light: !darkMode,
    };

    return (
      <header>
        <CustomNavbar
          className="navbar-expand-sm navbar-toggleable-sm border-bottom"
          light={!darkMode}
          dark={darkMode}
        >
          <Container>
            <NavbarBrand tag={Link} to="/">
              Salary control
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
              <Nav className="navbar-nav flex-grow" navbar>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/"
                    active={this.isCurrentPath('/')}
                    onClick={this.forceCollapseNavbar}
                  >
                    Home
                  </NavLink>
                </NavItem>
                <Dropdown nav isOpen={addDropdownIsOpen} toggle={this.toggleProductsDropdown} group>
                  <NavLink
                    tag={Link}
                    to="/new"
                    active={this.includesCurrentPath('/new')}
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
                    <DropdownItem tag={Link} to="/discounts/new" onClick={this.forceCollapseNavbar}>
                      Agregar descuento recurrente
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/discounts"
                    active={this.includesCurrentPath('/discounts')}
                    onClick={this.forceCollapseNavbar}
                  >
                    Descuentos
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/reports"
                    active={this.includesCurrentPath('/reports')}
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
        </CustomNavbar>
      </header>
    );
  }
}
