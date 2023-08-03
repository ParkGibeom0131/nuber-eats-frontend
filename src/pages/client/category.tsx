import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  CategoryQuery,
  CategoryQueryVariables,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import { Restaurant } from "../../components/restaurant";

// location: 어디에 있는지 알려줌
// history: 어디론가 가게 만들어줌

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
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
      category {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
  }
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const [page, setPage] = useState(1);
  // const location = useLocation();
  const params = useParams<ICategoryParams>();
  //   useEffect(() => {
  //     console.log(location);
  //   }, [location]);
  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug: params.slug,
        },
      },
    }
  );

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  console.log(data);
  return (
    <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div>
          {data?.category.totalPages ? (
            <div>
              <div className="grid mt-16 md:grid-cols-3 gap-x-6 gap-y-10">
                {data?.category.restaurants?.map((restaurant) => (
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
                  Page {page} of {data?.category.totalPages}
                </span>
                {page !== data?.category.totalPages ? (
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
