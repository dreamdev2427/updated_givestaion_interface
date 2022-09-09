import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import AppRoutes from "./routes";
import { store } from "./store";
import { Provider } from "react-redux";
import { useMediaQuery } from "react-responsive";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

import "./App.css";
import "slick-carousel/slick/slick.css";

import "slick-carousel/slick/slick-theme.css";

function Index() {
  const [loading, setLoading] = useState(true);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  var colorMode = null;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  colorMode = localStorage.getItem("color-theme");

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background:
              colorMode == null || colorMode == "light" ? "white" : "black",
          }}
        >
          <div
            className="loader"
            style={{
              backgroundImage:
                colorMode == null || colorMode == "light"
                  ? `url('/images/loader-light.gif')`
                  : `url('/images/loader-dark.gif')`,
            }}
          ></div>
        </div>
      ) : (
        <Provider store={store}>
          <AppRoutes />
          <NotificationContainer />
        </Provider>
      )}
    </>
  );
}

export default Index;

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById("root")
);
