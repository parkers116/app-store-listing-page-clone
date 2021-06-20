import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Recomendation.scss";

interface RecomendationProps {
  searchStr: string;
}

interface ObjRecomendedList {
  artistId: string;
  artistName: string;
  artistUrl: string;
  artworkUrl100: string;
  contentAdvisoryRating: string;
  copyright: string;
  genres: Array<ObjGenres>;
  id: string;
  kind: string;
  name: string;
  releaseDate: string;
  url: string;
}

interface ObjGenres {
  genreId: string;
  name: string;
  url: string;
}

const Recomendation = (props: RecomendationProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [arrRecomendedList, setArrRecomendedList] = useState<
    Array<ObjRecomendedList>
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(
        "https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-grossing/all/10/explicit.json"
      )
      .then((res) => {
        setArrRecomendedList(res.data.feed.results);
        setIsLoading(false);
      });
  };

  const filtering = (item: ObjRecomendedList) => {
    const searchStr = props.searchStr.toLowerCase();
    let isGenreMatch =
      item.genres.filter((item) => item.name.toLowerCase().match(searchStr))
        .length > 0;
    return (
      item.name.toLowerCase().match(searchStr) ||
      item.artistName.toLowerCase().match(searchStr) ||
      isGenreMatch
    );
  };

  return (
    <div className="recomendation">
      <div className="title">推介</div>
      {arrRecomendedList.length !== 0 && (
        <div className="horizontal-list">
          {arrRecomendedList
            .filter((item) => filtering(item))
            .map((item, id) => {
              return (
                <div key={id} className="list-item">
                  <img src={item.artworkUrl100} alt="logo" />
                  <div className="name">{item.name}</div>
                  <div className="genre">{item.genres[0].name}</div>
                </div>
              );
            })}
        </div>
      )}
      {isLoading && (
        <div className="load-spinner">
          <i className="fa fa-spinner fa-spin" />
        </div>
      )}
    </div>
  );
};

export default Recomendation;
