import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useOrganizationStore } from "./organizationStore";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (response) =>
        set({
          accessToken: response?.access,
          refreshToken: response?.refresh,
          user: response?.user,
          isAuthenticated: true,
        }),

      logout: () => {
        // Clear organization store on logout
        useOrganizationStore.getState().clearOrganizations();
        
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user) => {
        console.log("updating user", user);
        set({ user })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);