import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartWidget from './CartWidget/CartWidget';
import Container from 'react-bootstrap/Container';
import { UserContext } from '../context/UserContext';
import UserWidget from './User/UserWidget';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

// Assets 👇
import Logo from '../assets/images/logo.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/App.css';

// ! NO CONFUNDIR "NavBar" (Component->Element) con "Navbar" (bootstrap component)

const NavBar = () => {
    const { userData } = useContext(UserContext);

    return (
        <header>
            <Navbar className="App-navbar" bg="dark" variant="dark" expand="md">
                <Container>
                    <Navbar.Brand>
                        <Link to="/">
                            <img className="App-logo" src={Logo} alt="NatuFriend logo"></img>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="justify-content-center ms-auto me-auto">
                            <Nav.Item>
                                <Nav.Link as={Link} to="/">
                                    <span> Home </span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="products?category=remeras">
                                    <span> Remeras </span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="products?category=pantalones">
                                    <span> Pantalones </span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="products?category=buzos">
                                    <span> Buzos </span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        {userData && <CartWidget />}
                        {userData && <UserWidget />}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default NavBar;
