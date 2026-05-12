import axios from "axios";

// Replace with your actual Google Apps Script URL
const API = "https://script.google.com/macros/s/AKfycbx7_Wgdr7uPdPDrdpMXdekJHpvDusCoOoQzlrbDkooHbgGhpAzgQ-AlQqK6EfKC4qQ2/exec";

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'text/plain',
  }
});

// Product APIs
export const getProducts = async () => {
  try {
    const response = await apiClient.get(`${API}?type=products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "addProduct" }));
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "updateProduct" }));
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "deleteProduct" }));
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Appointment APIs
export const getAppointments = async () => {
  try {
    const response = await apiClient.get(`${API}?type=appointments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const bookAppointment = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "appointment" }));
    return response.data;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "updateAppointment" }));
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "deleteAppointment" }));
    return response.data;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Review APIs
export const getReviews = async () => {
  try {
    const response = await apiClient.get(`${API}?type=reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const addReview = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "review" }));
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const updateReview = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "updateReview" }));
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (data) => {
  try {
    const response = await apiClient.post(API, JSON.stringify({ ...data, type: "deleteReview" }));
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};