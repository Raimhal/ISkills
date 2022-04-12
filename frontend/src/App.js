import React from 'react'
import "./styles/App.css"
import "./styles/Course.css"
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/UI/navbar/Navbar";
import AppRouter from "./components/AppRouter";

const App = () => {
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
