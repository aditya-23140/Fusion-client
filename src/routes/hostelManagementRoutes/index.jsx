/**
 * Hostel Management API Routes
 * All API endpoints for the hostel management module
 */

import { host } from "../globalRoutes";

const BASE_URL = `${host}/hostelmanagement/api`;

// ══════════════════════════════════════════════════════════════
// HALL ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const hallsRoute = `${BASE_URL}/halls/`;
export const getHallRoute = (hallId) => `${BASE_URL}/halls/${hallId}/`;
export const createHallRoute = `${BASE_URL}/halls/create/`;
export const deleteHallRoute = (hallId) =>
  `${BASE_URL}/halls/${hallId}/delete/`;

// ══════════════════════════════════════════════════════════════
// CARETAKER & WARDEN ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const assignCaretakerRoute = `${BASE_URL}/caretakers/assign/`;
export const assignWardenRoute = `${BASE_URL}/wardens/assign/`;
export const assignBatchRoute = `${BASE_URL}/batches/assign/`;

// ══════════════════════════════════════════════════════════════
// GUEST ROOM BOOKING ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const createBookingRoute = `${BASE_URL}/bookings/create/`;
export const listBookingsRoute = `${BASE_URL}/bookings/`;
export const myBookingsRoute = `${BASE_URL}/bookings/my/`;
export const approveBookingRoute = `${BASE_URL}/bookings/approve/`;
export const rejectBookingRoute = (bookingId) =>
  `${BASE_URL}/bookings/${bookingId}/reject/`;

// ══════════════════════════════════════════════════════════════
// GUEST ROOM ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const listGuestRoomsRoute = (hallId) =>
  `${BASE_URL}/guest-rooms/hall/${hallId}/`;

// ══════════════════════════════════════════════════════════════
// NOTICE ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const listNoticesRoute = `${BASE_URL}/notices/`;
export const createNoticeRoute = `${BASE_URL}/notices/create/`;
export const deleteNoticeRoute = (noticeId) =>
  `${BASE_URL}/notices/${noticeId}/delete/`;

// ══════════════════════════════════════════════════════════════
// LEAVE ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const createLeaveRoute = `${BASE_URL}/leaves/create/`;
export const listLeavesRoute = `${BASE_URL}/leaves/`;
export const myLeavesRoute = `${BASE_URL}/leaves/my/`;
export const updateLeaveStatusRoute = `${BASE_URL}/leaves/update-status/`;

// ══════════════════════════════════════════════════════════════
// COMPLAINT ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const fileComplaintRoute = `${BASE_URL}/complaints/file/`;
export const listComplaintsRoute = `${BASE_URL}/complaints/`;
export const myComplaintsRoute = `${BASE_URL}/complaints/my/`;

// ══════════════════════════════════════════════════════════════
// FINE ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const imposeFineRoute = `${BASE_URL}/fines/impose/`;
export const listFinesRoute = `${BASE_URL}/fines/`;
export const myFinesRoute = `${BASE_URL}/fines/my/`;
export const updateFineRoute = (fineId) =>
  `${BASE_URL}/fines/${fineId}/update/`;
export const deleteFineRoute = (fineId) =>
  `${BASE_URL}/fines/${fineId}/delete/`;

// ══════════════════════════════════════════════════════════════
// INVENTORY ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const createInventoryRoute = `${BASE_URL}/inventory/create/`;
export const listInventoryRoute = (hallId) =>
  `${BASE_URL}/inventory/hall/${hallId}/`;
export const updateInventoryRoute = (inventoryId) =>
  `${BASE_URL}/inventory/${inventoryId}/update/`;
export const deleteInventoryRoute = (inventoryId) =>
  `${BASE_URL}/inventory/${inventoryId}/delete/`;

// ══════════════════════════════════════════════════════════════
// ATTENDANCE ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const markAttendanceRoute = `${BASE_URL}/attendance/mark/`;
export const listAttendanceRoute = (hallId) =>
  `${BASE_URL}/attendance/hall/${hallId}/`;

// ══════════════════════════════════════════════════════════════
// ROOM MANAGEMENT ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const listRoomsRoute = (hallId) => `${BASE_URL}/rooms/hall/${hallId}/`;
export const changeRoomRoute = `${BASE_URL}/rooms/change/`;

// ══════════════════════════════════════════════════════════════
// HISTORY ENDPOINTS
// ══════════════════════════════════════════════════════════════
export const listTransactionHistoryRoute = `${BASE_URL}/history/transactions/`;
export const listHostelHistoryRoute = `${BASE_URL}/history/hostel/`;

// ══════════════════════════════════════════════════════════════
// USER ROLE ENDPOINT
// ══════════════════════════════════════════════════════════════
export const userRoleRoute = `${BASE_URL}/user/role/`;
