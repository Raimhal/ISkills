import React, {useEffect} from 'react'
import "./styles/App.css"
import "./styles/Course.css"
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser, refreshTokens} from "./store/UserReducer";
import Navbar from "./components/UI/Navbar/Navbar";
import Loading from "./components/UI/Loading/Loading";
import "rsuite/dist/rsuite.min.css";
import '../node_modules/react-vis/dist/style.css';
import jwt_decode from "jwt-decode";
import {generateClientToken} from "./store/PurchaseReducer";

const App = () => {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.user.isLoading)



    useEffect( () => {
        const accessToken = localStorage.getItem('accessToken')
        dispatch(getCurrentUser())
        if(accessToken) {
            const exp = jwt_decode(accessToken).exp
            if(exp < Math.floor(+Date.now() / 1000))
                dispatch(refreshTokens())
            dispatch(generateClientToken())
        }
    }, [])

   return (
       !isLoading ?
           <div className="App">
                   <BrowserRouter>
                           <Navbar/>
                           <AppRouter/>
                   </BrowserRouter>
           </div>
           : <Loading/>

   )
}

export default App;
