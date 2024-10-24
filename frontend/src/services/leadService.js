import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Fetch all leads
export const fetchLeads = async (page = 1, pageSize = 20) => {
  try {
    return await axios.get(`${API_URL}/leads?page=${page}&per_page=${pageSize}`);
  } catch (error) {
    // console.error('Error fetching leads:', error);
    throw error;
  }
};

// Create a new lead
export const createLead = async (data) => {
  try {
    return await axios.post(`${API_URL}/leads`, data);
  } catch (error) {
    // console.error('Error creating lead:', error);
    throw error;
  }
};

// Update an existing lead
export const updateLead = async (id, data) => {
  try {
    return await axios.put(`${API_URL}/leads/${id}`, data);  // Sends lead_status_id
  } catch (error) {
    // console.error('Error updating lead:', error);
    throw error;
  }
};

// Delete a lead
export const deleteLead = async (id) => {
  try {
    return await axios.delete(`${API_URL}/leads/${id}`);
  } catch (error) {
    // console.error('Error deleting lead:', error);
    throw error;
  }
};

// Fetch all statuses for the dropdown
export const fetchStatuses = async () => {
  try {
    return await axios.get(`${API_URL}/statuses`); // Fetch statuses from the API
  } catch (error) {
    // console.error('Error fetching statuses:', error);
    throw error;
  }
};
