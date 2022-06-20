import React, {useContext, useEffect} from 'react'
import "./styles/App.css"
import "./styles/Course.css"
import {BrowserRouter, useNavigate} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "./store/UserReducer";
import Navbar from "./components/UI/Navbar/Navbar";
import Loading from "./components/UI/Loading/Loading";
import SlideMenu from "./components/UI/SlideMenu/SlideMenu";
import { MenuContext } from 'react-flexible-sliding-menu';
import "rsuite/dist/rsuite.min.css";

const App = () => {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.user.isLoading)


    useEffect( () => {
        const token = localStorage.getItem('accessToken')
        if(token)
            dispatch(getCurrentUser())
    }, [])

   return (
           <div className="App">
               {!isLoading ?
                   <BrowserRouter>
                           <Navbar/>
                           <AppRouter/>
                   </BrowserRouter>
               : <Loading/> }
           </div>

   )
}

export default App;
