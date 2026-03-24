/**
 * Hostel Management Routes
 * All API endpoint routes for the hostel management module
 */

const host = "http://127.0.0.1:8000";
const BASE_URL = `${host}/api/hostel`;

// Hall Routes
export const hallsRoute = `${BASE_URL}/halls/`;
export const getHallRoute = (hallId) => `${BASE_URL}/halls/${hallId}/`;
export const createHallRoute = `${BASE_URL}/halls/create/`;
export const deleteHallRoute = (hallId) => `${BASE_URL}/halls/${hallId}/delete/`;

// Caretaker Routes
export const assignCaretakerRoute = `${BASE_URL}/caretakers/assign/`;

// Warden Routes
export const assignWardenRoute = `${BASE_URL}/wardens/assign/`;

// Batch Routes
export const assignBatchRoute = `${BASE_URL}/batch/assign/`;

// Booking Routes
export const createBookingRoute = `${BASE_URL}/bookings/create/`;
export const listBookingsRoute = `${BASE_URL}/bookings/`;
export const myBookingsRoute = `${BASE_URL}/bookings/my/`;
export const approveBookingRoute = `${BASE_URL}/bookings/approve/`;
export const rejectBookingRoute = (bookingId) => `${BASE_URL}/bookings/${bookingId}/reject/`;

// Guest Room Routes
export const listGuestRoomsRoute = (hallId) => `${BASE_URL}/guest-rooms/hall/${hallId}/`;

// Notice Routes
export const listNoticesRoute = `${BASE_URL}/notices/`;
export const createNoticeRoute = `${BASE_URL}/notices/create/`;
export const deleteNoticeRoute = (noticeId) => `${BASE_URL}/notices/${noticeId}/delete/`;

// Leave Routes
export const createLeaveRoute = `${BASE_URL}/leaves/create/`;
export const listLeavesRoute = `${BASE_URL}/leaves/`;
export const myLeavesRoute = `${BASE_URL}/leaves/my/`;
export const updateLeaveStatusRoute = `${BASE_URL}/leaves/update-status/`;

// Complaint Routes
export const fileComplaintRoute = `${BASE_URL}/complaints/file/`;
export const listComplaintsRoute = `${BASE_URL}/complaints/`;
export const myComplaintsRoute = `${BASE_URL}/complaints/my/`;

// Fine Routes
export const imposeFineRoute = `${BASE_URL}/fines/impose/`;
export const listFinesRoute = `${BASE_URL}/fines/`;
export const myFinesRoute = `${BASE_URL}/fines/my/`;
export const updateFineRoute = (fineId) => `${BASE_URL}/fines/${fineId}/update/`;
export const deleteFineRoute = (fineId) => `${BASE_URL}/fines/${fineId}/delete/`;

// Inventory Routes
export const createInventoryRoute = `${BASE_URL}/inventory/create/`;
export const listInventoryRoute = (hallId) => `${BASE_URL}/inventory/hall/${hallId}/`;
export const updateInventoryRoute = (inventoryId) => `${BASE_URL}/inventory/${inventoryId}/update/`;
export const deleteInventoryRoute = (inventoryId) => `${BASE_URL}/inventory/${inventoryId}/delete/`;

// Attendance Routes
export const markAttendanceRoute = `${BASE_URL}/attendance/mark/`;
export const listAttendanceRoute = (hallId) => `${BASE_URL}/attendance/hall/${hallId}/`;

// Room Routes
export const listRoomsRoute = (hallId) => `${BASE_URL}/rooms/hall/${hallId}/`;
export const changeRoomRoute = `${BASE_URL}/rooms/change/`;

// History Routes
export const listTransactionHistoryRoute = `${BASE_URL}/transactions/`;
export const listHostelHistoryRoute = `${BASE_URL}/history/`;

// User Role Route
export const userRoleRoute = `${BASE_URL}/user/role/`;
