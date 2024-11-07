import { useContext } from "react";

import { UserContext } from "../contexts/UserContext";

/**
 * Custom hook to access the UserContext
 * @returns UserData | null - Returns user data or null if the user is not logged in
 */
export const useUser = () => {
  return useContext(UserContext);
};
