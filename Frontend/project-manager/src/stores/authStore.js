import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useOrganizationStore } from "./organizationStore";
import { normalizeMediaUrl } from "@/shared/utils/normalizeMediaUrl";

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    profile_picture: normalizeMediaUrl(user.profile_picture),
  };
};

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      fcm_token: null,

      login: (response) =>
        set({
          accessToken: response?.access,
          user: normalizeUser(response?.user),
          isAuthenticated: true,
        }),

      setAccessToken: (accessToken) =>
        set((state) => ({
          accessToken,
          isAuthenticated: !!accessToken || state.isAuthenticated,
        })),

      setFCMToken: (fcm_token) => set({fcm_token}),

      logout: () => {
        // Clear organization store on logout
        useOrganizationStore.getState().clearOrganizations();
        
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          fcm_token: null
        });
      },

      updateUser: (user) => {
        set({ user: normalizeUser(user) })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        fcm_token: state.fcm_token
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.user = normalizeUser(state.user);
        }
      },
    }
  )
);
