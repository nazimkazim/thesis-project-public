import React from "react";
import "./Organization.css";
import { Link } from "react-router-dom";
import { storeDetailsViewedItem } from "../../config/organization";

const Organization = ({ organization }) => {
  // console.log(organization)
  const handleClick = async () => {
    try {
      const objToSend = {
        qkey:organization.pl,
        categories: organization.categories.split(","),
        createdDate: new Date().toISOString(),
        location: organization.city,
        rating: organization.stars
      }

      // console.log(objToSend)
      await storeDetailsViewedItem(objToSend);
    } catch (error) {
      console.error("Failed to store item:", error);
    }
  };

  return (
    <div className="organization_item">
      <Link to={`/${organization.pl}`} onClick={handleClick}>
        <h2>{organization.business_name}</h2>
      </Link>
      <p>{organization.business_address}</p>
      <p>{organization.categories}</p>
      <img alt="" src={"https://fakeimg.pl/600x400"} />
    </div>
  );
};

export default Organization;
