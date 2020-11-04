const ROOT_BE_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:2000"
    : "https://api.parcel.money";

export const registerEndPoint = `${ROOT_BE_URL}/api/v1/users/create`;
