import { instance } from "../axios/instance";

export const getAllOrganizations = async (numOfITems) => {
  return (await instance.get(`/map?pages=${numOfITems}`)).data;
};

export const getOrganizationById = async (id) => {
  return (await instance.get(`/map/${id}`)).data;
};

export const searchByCategory = async (category) => {
  return await instance.post(`/map/searchByCategory`, {
    category,
  });
};

export const getOrganizationByName = async ({ name, limit, startKey }) => {
  const encodedStartKey = startKey
    ? encodeURIComponent(JSON.stringify(startKey))
    : "";
  return (
    await instance.get(
      `/map/search?name=${name}&limit=${limit}&startKey=${encodedStartKey}`
    )
  ).data;
};

export const storeDetailsViewedItem = async (item) => {
  return (await instance.post(`/queries/viewed-item`, item)).data;
};

export const getRecommendations = async({title}) => {
  return (await instance.post(`map/recommendations`, {
    title
  }))
}
