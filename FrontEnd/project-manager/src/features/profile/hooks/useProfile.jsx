import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileService";
import { useAuthStore } from "../../../stores/authStore";

export function useProfile() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  // Queries
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
    enabled: !!currentUser,
  });

//   const sessions = useQuery({
//     queryKey: ["profile", "sessions"],
//     queryFn: profileService.getActiveSessions,
//   });

  // Mutations
  const updateProfile = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["profile"]);
      // Update user in auth store
      useAuthStore.getState().updateUser(response.data);
    },
  });

  const uploadProfilePicture = useMutation({
    mutationFn: profileService.uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const deleteProfilePicture = useMutation({
    mutationFn: profileService.deleteProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const changePassword = useMutation({
    mutationFn: profileService.changePassword,
  });

  const deleteAccount = useMutation({
    mutationFn: profileService.deleteAccount,
    onSuccess: () => {
      useAuthStore.getState().logout();
    },
  });

  const revokeSession = useMutation({
    mutationFn: profileService.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", "sessions"]);
    },
  });

  return {
    // Data
    profile: profile.data?.data || currentUser,
    // sessions: sessions.data?.data || [],

    // Loading states
    isLoading: profile.isLoading,
    // isLoadingSessions: sessions.isLoading,
    error: profile.error,

    // Mutations
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    changePassword,
    deleteAccount,
    revokeSession,

    // Refetch
    refetch: profile.refetch,
  };
}