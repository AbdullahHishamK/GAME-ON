import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Games from './components/Games/Games'
import Publishers from './components/Publishers/Publishers'
import Genres from './components/Genres/Genres'
import Error from './components/Error/Error'
import { AuthProvider } from './components/auth/AuthContext'
import Details from './components/Details/Details'
import PublishersGame from './components/PublishersGame/PublishersGame'
import GenreGames from './components/GenresGame/GenreGames'
import User from './components/User/User'
import EditUser from './components/EditUser/EditUser'
import LatestNews from './components/LatestNews/LatestNews'

const router = createBrowserRouter([
  { path: '', element: <Layout /> , children: [
    {path: '/', element: <Login />},
    {path: '/home', element: <Home />},
    {path: '/games', element: <Games />},
    {path: '/publishers', element: <Publishers />},
    {path: '/genres', element: <Genres />},
    {path: '/register', element: <Register />},
    {path: '/login', element: <Login />},
    {path: '*', element: <Error />},
    {path: '/details/:id', element: <Details />},
    {path: '/publisher-games/:publisherName', element: <PublishersGame />},
    {path: '/genre-games/:genreName', element: <GenreGames />},
    {path: '/user', element: <User />},
    {path: '/edit-user', element: <EditUser />},
    {path: '/latest-news', element: <LatestNews />},

  ]},

])

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;