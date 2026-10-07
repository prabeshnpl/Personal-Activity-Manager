import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileService";
import { useAuthStore } from "../../../stores/authStore";

export function useProfile() {
  const queryClient = useQueryClient();

//   const sessions = useQuery({
//     queryKey: ["profile", "sessions"],
//     queryFn: profileService.getActiveSessions,
//   });

  // Mutations
  const updateProfile = useMutation({
    mutationFn: ({ data, userId }) => profileService.updateProfile(data, userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["profile"]);
      useAuthStore.getState().updateUser(response);
    },
  });

  const uploadProfilePicture = useMutation({
    mutationFn: ({file, userId}) => profileService.uploadProfilePicture(file, userId),
    onSuccess: async (response) => {
      queryClient.invalidateQueries(["profile"]);
      if (response && (response.id || response.email)) {
        useAuthStore.getState().updateUser(response);
      } else {
        try {
          const fresh = await profileService.getMe();
          useAuthStore.getState().updateUser(fresh);
        } catch (err) {
          console.warn('Failed to refresh user after picture upload', err);
        }
      }
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
    // sessions: sessions.data?.data || [],

    // Mutations
    updateProfile,
    uploadProfilePicture,
    changePassword,
    deleteAccount,
    revokeSession,
  };
}
