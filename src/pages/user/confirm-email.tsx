import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";
import { useMe } from "../../hooks/useMe";
import { useHistory } from "react-router-dom";
// import { useLocation } from "react-router-dom";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  // const { data: userData, refetch } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      // refetch()는 promise를 반환하므로 async await 적용
      // 실제 backend와 server, frontend가 있을 경우
      // production을 deploy 하고 있다면, refetch가 더 느림
      // 다른 API call을 만드는 것과 다름 없기 때문
      // refetch();
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push("/");
    }
  };
  const [verifyEmail] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });
  // const location = useLocation();
  useEffect(() => {
    const [, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
