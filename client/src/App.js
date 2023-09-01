import { useContext, useEffect, useState } from "react";
import "./App.css";
import { OrganizationsContext } from "./context/OrganizationsContext";
import {
  getAllOrganizations,
  getOrganizationByName,
  searchByCategory,
} from "./config/organization";
import OrganizationsList from "./components/organization/OrganizationsList";
import PlaceForAdverising from "./components/PlaceForAdverising";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToShow, setItemsToShow] = useState(10);
  const [searchType, setSearchType] = useState("byName");

  const { setOrganizations, clearFields, organizations } =
    useContext(OrganizationsContext);

  useEffect(() => {
    getAllOrganizations(itemsToShow).then((item) => {
      setOrganizations(item);
    });
  }, [itemsToShow]);

  let lastEvaluatedKey = null;

  const onSearchHandler = (e) => {
    e.preventDefault();
    setOrganizations([]);
    const params = {
      name: searchTerm,
      limit: 10,
    };

    // Only set a startKey if we have a lastEvaluatedKey
    if (lastEvaluatedKey) {
      params.startKey = JSON.stringify(lastEvaluatedKey);
    }

    getOrganizationByName(params).then((response) => {
      setOrganizations(response.items);

      // Store the last evaluated key for the next request
      lastEvaluatedKey = response.lastEvaluatedKey;
    });

    clearFields();
  };

  const onSearchHandlerByCategory = (e) => {
    e.preventDefault();
    setOrganizations([]);
    searchByCategory(searchTerm).then((response) => {
      setOrganizations(response.data);
    });

    clearFields();
  };

  return (
    <div className="container">
      <PlaceForAdverising />
      <h1>Location Search</h1>
      <form className="form">
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="byName">Search by name</option>
          <option value="byCategory">Search by category</option>
        </select>

        <div className="input-container">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            id="search"
            placeholder="Search for a location"
          />
          <button
            onClick={
              searchType === "byName"
                ? onSearchHandler
                : onSearchHandlerByCategory
            }
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
      <OrganizationsList />
      {organizations.length > 1 && (
        <button onClick={() => setItemsToShow(itemsToShow + 10)}>
          Load More
        </button>
      )}
    </div>
  );
}

export default App;
