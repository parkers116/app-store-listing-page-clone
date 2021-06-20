import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Rate from "rc-rate";
import { Waypoint } from "react-waypoint";

import "./AppList.scss";
import "rc-rate/assets/index.css";

interface AppListProps {
  searchStr: string;
}

interface ObjAppList {
  artistId: string;
  artistName: string;
  artistUrl: string;
  artworkUrl100: string;
  copyright: string;
  genres: Array<ObjGenres>;
  id: string;
  kind: string;
  name: string;
  releaseDate: string;
  url: string;
  averageUserRating: number;
  userRatingCount: number;
  description: string;
}

interface ObjGenres {
  genreId: string;
  name: string;
  url: string;
}

const AppList = (props: AppListProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [arrAppList, setArrAppList] = useState<Array<ObjAppList>>([]);

  const refIsEnterWaypoint = useRef(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(
        `https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-free/all/${
          arrAppList.length === 0 ? 10 : arrAppList.length + 10
        }/explicit.json`
      )
      .then(async (res) => {
        let response: Array<ObjAppList> = await Promise.all(
          res.data.feed.results.slice(-10).map(async (item: ObjAppList) => {
            const userRatingInfo = await axios.get(
              `https://itunes.apple.com/hk/lookup?id=${item.id}`
            );
            return {
              ...item,
              averageUserRating:
                userRatingInfo.data.results[0].averageUserRating,
              userRatingCount: userRatingInfo.data.results[0].userRatingCount,
              description: userRatingInfo.data.results[0].description,
            };
          })
        );
        setArrAppList([...arrAppList, ...response]);
        setIsLoading(false);
        refIsEnterWaypoint.current = false;
      });
  };

  const onEnterWaypoint = () => {
    if (!refIsEnterWaypoint.current) {
      refIsEnterWaypoint.current = true;
      fetchData();
    }
  };

  const filtering = (item: ObjAppList) => {
    const searchStr = props.searchStr.toLowerCase();
    let isGenreMatch =
      item.genres.filter((item) => item.name.toLowerCase().match(searchStr))
        .length > 0;
    return (
      item.name.toLowerCase().match(searchStr) ||
      item.artistName.toLowerCase().match(searchStr) ||
      item.description.toLowerCase().match(searchStr) ||
      isGenreMatch
    );
  };

  return (
    <div className="app-list">
      {arrAppList
        .filter((item) => filtering(item))
        .map((item, id) => {
          return (
            <div key={id} className="app-item">
              {id > arrAppList.length - 5 && arrAppList.length < 100 && (
                <Waypoint onEnter={onEnterWaypoint} />
              )}
              <div className="rank">{id + 1}</div>
              <div className="image">
                <img src={item.artworkUrl100} alt="logo" />
              </div>
              <div className="description">
                <div className="name">{item.name}</div>
                <div className="genre">{item.genres[0].name}</div>
                <div className="stars">
                  <Rate
                    defaultValue={item.averageUserRating}
                    disabled
                    //   style={{ fontSize: 10 }}
                    allowHalf
                    allowClear={false}
                  />
                  <div>({item.userRatingCount})</div>
                </div>
              </div>
            </div>
          );
        })}
      {isLoading && (
        <div className="load-spinner">
          <i className="fa fa-spinner fa-spin" />
        </div>
      )}
    </div>
  );
};

export default AppList;
