import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrganizationStore = create(
  persist(
    (set, get) => ({
      organizations: [],
      activeOrganization: null,

      setOrganizations: (orgs) => {
        const currentActive = get().activeOrganization;
        set({
          organizations: orgs,
          // If no active org, set first one (personal org)
          activeOrganization: currentActive || orgs[0] || null,
        });
      },

      setActiveOrganization: (org) => {
        set({ activeOrganization: org });
        // Dispatch event for components to refresh
        window.dispatchEvent(
          new CustomEvent("organization-switched", { 
            detail: { orgId: org.id } 
          })
        );
      },

      switchOrganization: (orgId) => {
        const orgs = get().organizations;
        const org = orgs.find((o) => o.id === orgId);
        if (org) {
          get().setActiveOrganization(org);
        }
      },

      addOrganization: (org) => {
        set((state) => ({
          organizations: [...state.organizations, org],
        }));
      },

      clearOrganizations: () =>
        set({
          organizations: [],
          activeOrganization: null,
        }),
    }),
    {
      name: "organization-storage",
      partialize: (state) => ({
        organizations: state.organizations,
        activeOrganization: state.activeOrganization,
      }),
    }
  )
);