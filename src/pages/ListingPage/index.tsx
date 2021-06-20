import React, { useState } from "react";

import Recomendation from "./components/Recomendation";
import AppList from "./components/AppList";

import "./index.scss";

interface ListingPageProps {}

const ListingPage = (props: ListingPageProps) => {
  const [searchStr, setSearchStr] = useState<string>("");

  const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStr(evt.target.value);
  };

  return (
    <div className="listing-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="&#xF002;&nbsp;&nbsp;搜尋"
          value={searchStr}
          onChange={onChangeInput}
        />
      </div>
      <Recomendation searchStr={searchStr} />
      <AppList searchStr={searchStr} />
    </div>
  );
};

export default ListingPage;
