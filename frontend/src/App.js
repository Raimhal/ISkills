import React, {useEffect} from 'react'
import "./styles/App.css"
import "./styles/Course.css"
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/UI/navbar/Navbar";
import AppRouter from "./components/AppRouter";
import {useDispatch} from "react-redux";
import {setTokens} from "./store/UserReducer";

const App = () => {
    const dispatch = useDispatch()
    useEffect( () => {
        const tokens = {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken')
        }
        dispatch(setTokens(tokens))
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
