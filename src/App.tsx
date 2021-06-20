import React from "react";

import ListingPage from "./pages/ListingPage";

import "./App.scss";
import "font-awesome/css/font-awesome.min.css";

function App() {
  return (
    <div className="App">
      {/* will add router here if there are many pages */}
      <ListingPage />
    </div>
  );
}

export default App;
