import React, { Component } from "react";
import {
  Router,
  Stack,
  Scene,
  Modal,
  Lightbox
} from "react-native-router-flux";
import Login from "./Login";
import List from "./List";

const Routes = props => {
  return (
    <Router>
      <Lightbox>
        <Stack key="root">
            <Scene
                key="home"
                component={Login}
                hideNavBar
                type="replace"
                initial
            />
            <Scene
                key="list"
                component={List}
                hideNavBar
                type="replace"
            />
          </Stack>
      </Lightbox>
    </Router>
  );
};

export default Routes;