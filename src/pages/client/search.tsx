import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    // Lazy Query
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return history.replace("/");
    }
    callQuery({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [history, location, callQuery, page]);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div>
          {data?.searchRestaurant.totalPages ? (
            <div>
              <div className="grid mt-16 md:grid-cols-3 gap-x-6 gap-y-10">
                {data?.searchRestaurant.restaurants?.map((restaurant) => (
                  <Restaurant
                    key={restaurant.id}
                    id={restaurant.id + ""}
                    coverImage={restaurant.coverImage}
                    name={restaurant.name}
                    categoryName={restaurant.category?.name}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
                {page > 1 ? (
                  <button
                    onClick={onPrevPageClick}
                    className="focus:outline-none font-medium text-2xl"
                  >
                    &larr;
                  </button>
                ) : (
                  <div></div>
                )}
                <span>
                  Page {page} of {data?.searchRestaurant.totalPages}
                </span>
                {page !== data?.searchRestaurant.totalPages ? (
                  <button
                    onClick={onNextPageClick}
                    className="focus:outline-none font-medium text-2xl"
                  >
                    &rarr;
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <span className="text-center max-w-md items-center mx-auto mt-20">
              <h2>Can't find any restaurant.</h2>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
