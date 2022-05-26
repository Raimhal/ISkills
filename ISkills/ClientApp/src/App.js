import React, {useEffect} from 'react'
import "./styles/App.css"
import "./styles/Course.css"
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/UI/Navbar/Navbar";
import AppRouter from "./components/AppRouter";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser, setIsAdmin, setIsAuth, setUser} from "./store/UserReducer";

const App = () => {
    const dispatch = useDispatch()

    useEffect( () => {
        const token = localStorage.getItem('accessToken')
        if(token)
            dispatch(getCurrentUser())

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
