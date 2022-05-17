import React, {useEffect} from 'react'
import "./styles/App.css"
import "./styles/Course.css"
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/UI/navbar/Navbar";
import AppRouter from "./components/AppRouter";
import {useDispatch} from "react-redux";
import {setIsAdmin, setIsAuth, setUser} from "./store/UserReducer";

const App = () => {
    const dispatch = useDispatch()
    useEffect( () => {
        const localStorageUser = localStorage.getItem('currentUser')
        if(localStorageUser) {
            const currentUser = JSON.parse(localStorageUser)
            const isAuth = JSON.parse(localStorage.getItem('isAuth'))
            const isAdmin = JSON.parse(localStorage.getItem('isAdmin'))
            dispatch(setIsAuth(isAuth))
            dispatch(setIsAdmin(isAdmin))
            dispatch(setUser(currentUser))
        }
    }, [])

   return (
       <div className="App">
           <BrowserRouter>
               <Navbar />
               <AppRouter />
           </BrowserRouter>
       </div>
   )
}

export default App;
