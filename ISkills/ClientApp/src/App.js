import React, {useEffect} from 'react'
import "./styles/App.css"
import "./styles/Course.css"
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {useDispatch} from "react-redux";
import {getCurrentUser} from "./store/UserReducer";
import Navbar from "./components/UI/navbar/Navbar";

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
               <Navbar/>
               <AppRouter/>
           </BrowserRouter>
       </div>
   )
}

export default App;
