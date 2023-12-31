import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams } from "react-router-dom";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();

  const history = useHistory();

  const [createDishMutation, { loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    unregister,
  } = useForm<IForm>({
    mode: "onChange",
    shouldUnregister: true,
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionObject = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObject,
        },
      },
    });
    history.goBack();
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    unregister(`${idToDelete}-optionName`);
    unregister(`${idToDelete}-optionExtra`);
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("name", { required: "Name is required." })}
          className="input"
          type="text"
          placeholder="Name"
        />
        <input
          {...register("price", { required: "Price is required." })}
          className="input"
          type="number"
          min={0}
          placeholder="Price"
        />
        <input
          {...register("description", { required: "Description is required." })}
          className="input"
          type="text"
          placeholder="Description"
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-optionName`)}
                  className="py-2 px-4 mr-3 focus:outline-none focus: border-gray-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  {...register(`${id}-optionExtra`)}
                  className="py-2 px-4 focus:outline-none focus: border-gray-600 border-2"
                  type="number"
                  min={0}
                  defaultValue={0}
                  placeholder="Option Extra"
                />
                <span
                  onClick={() => onDeleteClick(id)}
                  className="cursor-pointer py-3 px-4 mt-5 ml-3"
                >
                  ❌
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Create Dish"
        ></Button>
      </form>
    </div>
  );
};
