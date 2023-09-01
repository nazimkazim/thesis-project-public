import React, { useEffect, useState } from "react";
import "./OrganizationDetails.css";
import { useParams } from "react-router-dom";
import {
  getOrganizationById,
  getRecommendations,
} from "../../config/organization";

function OrganizationDetails() {
  const [organization, setOrganization] = useState([]);
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    console.log('req')
    getOrganizationById(id).then((organization) => {
      setOrganization(organization);
      getRecommendations({ title: organization.business_name }).then((data) => {
        console.log(data)
        setRecommendations(data.data);
      });
      setLoading(false);
    });
  }, []);

  function convertHours(obj) {
    const hours = Object.entries(obj);
    const formedHours = hours.map(([day, hours]) => {
      return `${day}: ${hours}`;
    });
    return formedHours.join(", ");
  }

  return (
    <div className="organizations__details_container">
      <div className="organization__details">
        {!organization?.length && !loading ? (
          <div>
            <h2 className="organization-title">
              {organization?.business_name}
            </h2>
            <p className="organization-address">
              {organization?.business_address ?? ""}
            </p>
            <img
              alt=""
              className="organization-image"
              src={"https://fakeimg.pl/600x400"}
            />

            <div className="organization-review">
              <h3>Customer Review</h3>
              <p>
                "Great organization! They provided outstanding services and
                solutions. Highly recommended!"
              </p>
              <span className="review-author">- John Doe</span>
            </div>
            <div className="organization-schedule">
              <div>{convertHours(organization?.hours) ?? ""}</div>
            </div>
          </div>
        ) : (
          <div>The organization is loading...</div>
        )}
      </div>
      <div className="organizations__details_recommendation">
        {recommendations?.map((recommendation, index) => {
          return (
            <div key={index} className="organizations__details_recommended-place">
              {recommendation?.business_name}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default OrganizationDetails;
