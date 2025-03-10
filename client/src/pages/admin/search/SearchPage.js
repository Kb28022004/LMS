import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import Filter from "../../filter/Filter";
import SearchResult from "./SearchResult";
import { CircularProgress } from "@mui/material";
import { useGetSearchCoursesQuery } from "../../../features/api/courseApi";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  console.log("🔍 API Query Parameters:", {
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const { data, isLoading, refetch } = useGetSearchCoursesQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  useEffect(() => {
    refetch();
  }, [selectedCategories, sortByPrice, refetch]);

  const handleFilterChange = (categories, price) => {
    console.log("🛠 Selected Categories:", categories); 
    console.log("🛠 Sort By Price:", price); 
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  const isEmpty = !isLoading && data?.courses?.length === 0;

  return (
    <div className="searchPageMainContainer">
      <div className="searchPageContainer">
        <div className="searchPageUpperContainer">
          <p>Result for "{query}"</p>
          <p>
            Showing results for{" "}
            <span>
              <i>{query}</i>
            </span>
          </p>
        </div>
        <div className="searchPageLowerContainer">
          <div className="searchPageLowerContainer-leftSide">
            <Filter handleFilterChange={handleFilterChange} />
          </div>
          {isLoading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CircularProgress style={{ color: "black" }} size={145} />
            </div>
          ) : (
            <div className="searchPageLowerContainer-rightSide">
              {isEmpty ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <h1>No Search Found 😏</h1>
                </div>
              ) : (
                <SearchResult data={data} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
