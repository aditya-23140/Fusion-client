/**
 * Hostel Management API Service
 * Axios instance and API calls for the hostel management module
 */

import axios from "axios";
import {
  hallsRoute,
  getHallRoute,
  createHallRoute,
  deleteHallRoute,
  assignCaretakerRoute,
  assignWardenRoute,
  assignBatchRoute,
  createBookingRoute,
  listBookingsRoute,
  myBookingsRoute,
  approveBookingRoute,
  rejectBookingRoute,
  listGuestRoomsRoute,
  listNoticesRoute,
  createNoticeRoute,
  deleteNoticeRoute,
  createLeaveRoute,
  listLeavesRoute,
  myLeavesRoute,
  updateLeaveStatusRoute,
  fileComplaintRoute,
  listComplaintsRoute,
  myComplaintsRoute,
  imposeFineRoute,
  listFinesRoute,
  myFinesRoute,
  updateFineRoute,
  deleteFineRoute,
  createInventoryRoute,
  listInventoryRoute,
  updateInventoryRoute,
  deleteInventoryRoute,
  markAttendanceRoute,
  listAttendanceRoute,
  listRoomsRoute,
  changeRoomRoute,
  listTransactionHistoryRoute,
  listHostelHistoryRoute,
  userRoleRoute,
} from "../../routes/hostelManagementRoutes";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Create axios instance with auth headers
const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ══════════════════════════════════════════════════════════════
// HALL API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchHalls = async () => {
  const response = await apiClient.get(hallsRoute);
  return response.data;
};

export const fetchHall = async (hallId) => {
  const response = await apiClient.get(getHallRoute(hallId));
  return response.data;
};

export const createHall = async (hallData) => {
  const response = await apiClient.post(createHallRoute, hallData);
  return response.data;
};

export const deleteHall = async (hallId) => {
  const response = await apiClient.delete(deleteHallRoute(hallId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// CARETAKER & WARDEN API CALLS
// ══════════════════════════════════════════════════════════════

export const assignCaretaker = async (data) => {
  const response = await apiClient.post(assignCaretakerRoute, data);
  return response.data;
};

export const assignWarden = async (data) => {
  const response = await apiClient.post(assignWardenRoute, data);
  return response.data;
};

export const assignBatch = async (data) => {
  const response = await apiClient.post(assignBatchRoute, data);
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// GUEST ROOM BOOKING API CALLS
// ══════════════════════════════════════════════════════════════

export const createBooking = async (bookingData) => {
  const response = await apiClient.post(createBookingRoute, bookingData);
  return response.data;
};

export const fetchBookings = async () => {
  const response = await apiClient.get(listBookingsRoute);
  return response.data;
};

export const fetchMyBookings = async () => {
  const response = await apiClient.get(myBookingsRoute);
  return response.data;
};

export const approveBooking = async (data) => {
  const response = await apiClient.post(approveBookingRoute, data);
  return response.data;
};

export const rejectBooking = async (bookingId) => {
  const response = await apiClient.post(rejectBookingRoute(bookingId));
  return response.data;
};

export const fetchGuestRooms = async (hallId) => {
  const response = await apiClient.get(listGuestRoomsRoute(hallId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// NOTICE API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchNotices = async () => {
  const response = await apiClient.get(listNoticesRoute);
  return response.data;
};

export const createNotice = async (noticeData) => {
  const response = await apiClient.post(createNoticeRoute, noticeData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteNotice = async (noticeId) => {
  const response = await apiClient.delete(deleteNoticeRoute(noticeId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// LEAVE API CALLS
// ══════════════════════════════════════════════════════════════

export const createLeave = async (leaveData) => {
  const response = await apiClient.post(createLeaveRoute, leaveData);
  return response.data;
};

export const fetchLeaves = async () => {
  const response = await apiClient.get(listLeavesRoute);
  return response.data;
};

export const fetchMyLeaves = async () => {
  const response = await apiClient.get(myLeavesRoute);
  return response.data;
};

export const updateLeaveStatus = async (data) => {
  const response = await apiClient.post(updateLeaveStatusRoute, data);
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// COMPLAINT API CALLS
// ══════════════════════════════════════════════════════════════

export const fileComplaint = async (complaintData) => {
  const response = await apiClient.post(fileComplaintRoute, complaintData);
  return response.data;
};

export const fetchComplaints = async () => {
  const response = await apiClient.get(listComplaintsRoute);
  return response.data;
};

export const fetchMyComplaints = async () => {
  const response = await apiClient.get(myComplaintsRoute);
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// FINE API CALLS
// ══════════════════════════════════════════════════════════════

export const imposeFine = async (fineData) => {
  const response = await apiClient.post(imposeFineRoute, fineData);
  return response.data;
};

export const fetchFines = async () => {
  const response = await apiClient.get(listFinesRoute);
  return response.data;
};

export const fetchMyFines = async () => {
  const response = await apiClient.get(myFinesRoute);
  return response.data;
};

export const updateFine = async (fineId, data) => {
  const response = await apiClient.put(updateFineRoute(fineId), data);
  return response.data;
};

export const deleteFine = async (fineId) => {
  const response = await apiClient.delete(deleteFineRoute(fineId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// INVENTORY API CALLS
// ══════════════════════════════════════════════════════════════

export const createInventory = async (inventoryData) => {
  const response = await apiClient.post(createInventoryRoute, inventoryData);
  return response.data;
};

export const fetchInventory = async (hallId) => {
  const response = await apiClient.get(listInventoryRoute(hallId));
  return response.data;
};

export const updateInventory = async (inventoryId, data) => {
  const response = await apiClient.put(updateInventoryRoute(inventoryId), data);
  return response.data;
};

export const deleteInventory = async (inventoryId) => {
  const response = await apiClient.delete(deleteInventoryRoute(inventoryId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// ATTENDANCE API CALLS
// ══════════════════════════════════════════════════════════════

export const markAttendance = async (attendanceData) => {
  const response = await apiClient.post(markAttendanceRoute, attendanceData);
  return response.data;
};

export const fetchAttendance = async (hallId) => {
  const response = await apiClient.get(listAttendanceRoute(hallId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// ROOM API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchRooms = async (hallId) => {
  const response = await apiClient.get(listRoomsRoute(hallId));
  return response.data;
};

export const changeRoom = async (data) => {
  const response = await apiClient.post(changeRoomRoute, data);
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HISTORY API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchTransactionHistory = async () => {
  const response = await apiClient.get(listTransactionHistoryRoute);
  return response.data;
};

export const fetchHostelHistory = async () => {
  const response = await apiClient.get(listHostelHistoryRoute);
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// USER ROLE API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchUserRole = async () => {
  const response = await apiClient.get(userRoleRoute);
  return response.data;
};
