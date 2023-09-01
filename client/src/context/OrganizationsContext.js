import React, { useState } from "react";

export const OrganizationsContext = React.createContext(null);

export const ContextWrapper = (props) => {
  const [organizations, setOrganizations] = useState([]);


  const clearFields = () => {
    setOrganizations([]);
  };

  return (
    <OrganizationsContext.Provider
      value={{ organizations, setOrganizations, clearFields }}
    >
      {props.children}
    </OrganizationsContext.Provider>
  );
};