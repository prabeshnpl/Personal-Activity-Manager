import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const organizationService = {
  // Organization
  getUserOrganizations: () =>
    api.get(`${ENDPOINTS.ORGANIZATIONS}/`),

  createOrganization: (data) =>
    api.post(`${ENDPOINTS.ORGANIZATIONS}/`, data),

  updateOrganization: (data) =>
    api.put(`${ENDPOINTS.ORGANIZATIONS}/`, data),

  deleteOrganization: () =>
    api.delete(`${ENDPOINTS.ORGANIZATIONS}/`),

  getOrganizationDetails: (orgId) =>
    api.get(`${ENDPOINTS.ORGANIZATIONS}/${orgId}/`),

  // Members
  inviteMember: (data) =>
    api.post(`${ENDPOINTS.ORGANIZATIONS}/`, data),

  removeMember: (memberId) =>
    api.delete(`${ENDPOINTS.MEMBERS}/${memberId}`),

  updateMember: (memberId, data) =>
    api.put(`${ENDPOINTS.MEMBERS}/${memberId}/`, data),

  getOrganizationMembers: () =>
    api.get(`${ENDPOINTS.MEMBERS}/`),

};
