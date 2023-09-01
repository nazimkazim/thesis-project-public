import React, { useContext } from "react";
import { OrganizationsContext } from "../../context/OrganizationsContext";
import Organization from "./Organization";
import "./OrganizationsList.css";

const OrganizationsList = () => {
  let { organizations } = useContext(OrganizationsContext);
  if (!Array.isArray(organizations)) {
    return <div>No organizations available</div>;
  } else {
    return (
      <div className="organizations_list">
        {organizations?.map((organization, index) => (
          <Organization key={index} organization={organization} />
        ))}
      </div>
    );
  }
};

export default OrganizationsList;
