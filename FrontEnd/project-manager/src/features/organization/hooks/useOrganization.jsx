import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "../services/organizationService";

export function useOrganizations() {
  const queryClient = useQueryClient();

  const members = useQuery({
    queryKey: ["organization", "members"],
    queryFn: () => organizationService.getOrganizationMembers(),
  })
  
  const currentMember = members.data ? members.data[0] : null;

  //Mutations
  const inviteMember = useMutation({
    mutationFn: organizationService.inviteMember, // POST
    onSuccess: () => {
      // invalidate cache so UI refreshes
      queryClient.invalidateQueries(["organization", "members"]);
    },
  });

  const updateMember = useMutation({
    mutationFn: organizationService.updateMember, // PUT
    onSuccess: () => {
      // invalidate cache so UI refreshes
      queryClient.invalidateQueries(["organization", "members"]);
    },
  });

  const removeMember = useMutation({
    mutationFn: organizationService.removeMember, // DELETE
    onSuccess: () => {
      // invalidate cache so UI refreshes
      queryClient.invalidateQueries(["organization", "members"]);
    },
  });

  const updateOrganization = useMutation({
    mutationFn: organizationService.updateOrganization, // PUT
    onSuccess: () => {
      // invalidate cache so UI refreshes
      queryClient.invalidateQueries(["organization", "members"]);
    },
  });

  const canManageMembers = currentMember?.role === "admin" || currentMember?.role === "owner";
  const canEditOrganization =
    currentMember?.role === "admin" || currentMember?.role === "owner";

  return {
    members,
    currentMember,
    inviteMember,
    updateMember,
    removeMember,
    updateOrganization,
    canManageMembers,
    canEditOrganization,
  };
}
