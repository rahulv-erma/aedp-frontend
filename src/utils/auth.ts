"use server";

import { cookies } from "next/headers";

import { AUTH_KEY } from "@/constants";

/**
 * Helper function to set the auth token in Next.js cookies.
 */
export const setAuthToken = (authToken: string) => {
  const cookieStore = cookies();

  cookieStore.set(AUTH_KEY, authToken, {
    path: "/",
    httpOnly: true,
  });
};

/**
 * Helper function to get the auth token from Next.js cookies.
 */
export const getAuthToken = (): string | undefined => {
  const cookieStore = cookies();
  const authTokenCookie = cookieStore.get(AUTH_KEY);
  return authTokenCookie?.value;
};

/**
 * Helper function to delete the auth token from cookies
 */
export const deleteAuthToken = () => {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_KEY);
};
