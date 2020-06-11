import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/home";
import CreatePoint from "./pages/point/create";
import CreatePointSucess from "./pages/point/createSucess";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} exact path="/" />
      <Route component={CreatePoint} exact path="/cadastro" />
      <Route component={CreatePointSucess} path="/cadastro/sucesso" />
    </BrowserRouter>
  );
};

export default Routes;
