// src/routes/authLoader.js
import { redirect } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export const authLoader = async () => {
  const store = useAuthStore.getState();

  if (!store.hasHydrated) {
    // wait briefly for persist hydration
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  if (!useAuthStore.getState().isAuthenticated) {
    throw redirect("/login");
  }
  // else if (useAuthStore.getState().isAuthenticated) {
  //   throw redirect("/");
  // }

  return null;
};
