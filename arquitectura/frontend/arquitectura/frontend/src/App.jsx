// import './App.css';

// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// //Components 
// import { Register } from './Register/Register';
// import { Login } from './Login/Login';

// export const App = () => {
//   return (
//     <>
//       <BrowserRouter>
//         Navbar
//         <Routes>
//           <Route path='/register' element={<Register />} />
//           <Route path='/login' element={<Login />} />
//           <Route path='*' element={<h1>404 Not Found</h1>} />
//         </Routes>
//         Footer
//       </BrowserRouter>

//     </>

//   )
// }

// Libraries and resources
import { Routes, Route } from 'react-router-dom';
// Components
import NavBar from './components/NavBar';
import { Home } from './pages/Home';
import ItemListContainer from './pages/ItemListContainer';
import ItemDetailContainer from './pages/ItemDetailContainer';

import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { Checkout } from './pages/Checkout';
// Classes

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/App.css';
// React Hooks
import RegisterForm from './pages/RegisterContainer';

const App = () => {
    return (
        <UserProvider>
            <CartProvider>
                <div className="App">
                    <NavBar />
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/products/*" element={<ItemListContainer />} />
                        <Route exact path="/cart" element={<Checkout />} />
                        <Route exact path="/item/:id" element={<ItemDetailContainer />} />
                        <Route exact path="/register" element={<RegisterForm />} />
                    </Routes>
                    <Footer />
                </div>
            </CartProvider>
        </UserProvider>
    );
};

export default App;
