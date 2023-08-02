import React from "react";
import nuberLogo from "../images/logo.svg";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// body font-size: 5px
// div font-size: 50px
// margin-top: 1em => 50px / 2em => 100px
// margin-top: 1rem => 5px / 2rem => 10px
// em은 가장 가까운 font-size가 div의 font-size가 50px이기 때문에, margin-top: 1em은 50px, 2em은 100px
// rem은 root em으로 body의 font-szie가 5px 이라면 1rem은 5px, 2rem은 10px로 body의 font-size가 됨

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <header className="py-4">
      <div className="w-full px-5 xl:px-0  max-w-screen-xl mx-auto flex justify-between items-center">
        <img src={nuberLogo} alt="Nuber Eats" className="w-24" />
        <span className="text-xs">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-xl" />
          </Link>
        </span>
      </div>
    </header>
  );
};
