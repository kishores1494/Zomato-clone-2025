import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./Home/Home";
import Filter from "../Component/Filter/Filter";
import Quicksearch from "./Quicksearch/QuickSearch";
import Details from "./Details/Details";
import Header from "../Component/Header/Header";


function Router() {
  return (
      <BrowserRouter>
      <Header/>
      <Routes >
        <Route  path="/" element={<><Home/></>} />
        <Route  path="/filter" element={<Filter/>} />
        <Route path="/Quicksearch" element={<Quicksearch/>}/>
        <Route  path="/details" element={<Details/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
