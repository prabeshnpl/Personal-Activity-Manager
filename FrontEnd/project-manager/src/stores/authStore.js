import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useOrganizationStore } from "./organizationStore";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      login: (response) =>
        set({
          accessToken: response?.access,
          user: response?.user,
          isAuthenticated: true,
        }),

      setAccessToken: (accessToken) =>
        set((state) => ({
          accessToken,
          isAuthenticated: !!accessToken || state.isAuthenticated,
        })),

      logout: () => {
        // Clear organization store on logout
        useOrganizationStore.getState().clearOrganizations();
        
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user) => {
        set({ user })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
