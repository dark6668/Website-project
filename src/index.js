import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './page/login/login';
import HomePage from './page/1/page1';
import AirbnbPage from './page/2/Air-bnb-page';
import Wishlists from './page/1/Wishlists';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router = createBrowserRouter([
  {
    path: '',
    element: <Login />
  },

  {
    path: 'home-page',
    element: <HomePage />
  },
  {
    path: 'home-page/*',
    element: <AirbnbPage />
  },
  {
    path: 'Wishlists',
    element: <Wishlists />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
