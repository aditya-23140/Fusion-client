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
export const deleteHallRoute = (hallId) =>
  `${BASE_URL}/halls/${hallId}/delete/`;

// Hall Room Routes
export const hallRoomsRoute = (hallId) => `${BASE_URL}/halls/${hallId}/rooms/`;
export const hallRoomDetailRoute = (hallId, roomId) =>
  `${BASE_URL}/halls/${hallId}/rooms/${roomId}/`;

// Super Admin Routes
export const assignWardenRoute = `${BASE_URL}/admin/assign-warden/`;
export const assignCaretakerRoute = `${BASE_URL}/admin/assign-caretaker/`;
export const facultyListRoute = `${BASE_URL}/admin/faculty/`;
export const staffListRoute = `${BASE_URL}/admin/staff/`;
export const allocateBatchRoute = `${BASE_URL}/admin/allocate-batch/`;
export const activeBatchYearsRoute = `${BASE_URL}/admin/active-batches/`;
export const roomRenameRoute = (roomId) =>
  `${BASE_URL}/admin/rooms/${roomId}/rename/`;

// Booking Routes
export const createBookingRoute = `${BASE_URL}/bookings/create/`;
export const listBookingsRoute = `${BASE_URL}/bookings/`;
export const myBookingsRoute = `${BASE_URL}/bookings/my/`;
export const approveBookingRoute = `${BASE_URL}/bookings/approve/`;
export const rejectBookingRoute = (bookingId) =>
  `${BASE_URL}/bookings/${bookingId}/reject/`;

// Guest Room Routes
export const listGuestRoomsRoute = (hallId) =>
  `${BASE_URL}/guest-rooms/hall/${hallId}/`;

// Notice Routes
export const listNoticesRoute = `${BASE_URL}/notices/`;
export const createNoticeRoute = `${BASE_URL}/notices/create/`;
export const deleteNoticeRoute = (noticeId) =>
  `${BASE_URL}/notices/${noticeId}/delete/`;

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
export const updateFineRoute = (fineId) =>
  `${BASE_URL}/fines/${fineId}/update/`;
export const deleteFineRoute = (fineId) =>
  `${BASE_URL}/fines/${fineId}/delete/`;

// Inventory Routes
export const createInventoryRoute = `${BASE_URL}/inventory/create/`;
export const listInventoryRoute = (hallId) =>
  `${BASE_URL}/inventory/hall/${hallId}/`;
export const updateInventoryRoute = (inventoryId) =>
  `${BASE_URL}/inventory/${inventoryId}/update/`;
export const deleteInventoryRoute = (inventoryId) =>
  `${BASE_URL}/inventory/${inventoryId}/delete/`;

// Attendance Routes
export const markAttendanceRoute = `${BASE_URL}/attendance/mark/`;
export const listAttendanceRoute = (hallId) =>
  `${BASE_URL}/attendance/hall/${hallId}/`;

// Room Routes
export const listRoomsRoute = (hallId) => `${BASE_URL}/rooms/hall/${hallId}/`;
export const changeRoomRoute = `${BASE_URL}/rooms/change/`;

// History Routes
export const listTransactionHistoryRoute = `${BASE_URL}/transactions/`;
export const listHostelHistoryRoute = `${BASE_URL}/history/`;

// User Role Route
export const userRoleRoute = `${BASE_URL}/user/role/`;

// ═══════════════════════════════════════════════════════════════
// DRF-STYLE ROUTES FOR src/Modules/HostelManagement/api.js
// ═══════════════════════════════════════════════════════════════

// Hall Management
export const hallDetailRoute = (hallId) => `${BASE_URL}/halls/${hallId}/`;

// Leave Management (HM-WF-101)
export const leavesRoute = `${BASE_URL}/leaves/`;
export const leaveDetailRoute = (leaveId) => `${BASE_URL}/leaves/${leaveId}/`;
export const leaveApproveRoute = (leaveId) =>
  `${BASE_URL}/leaves/${leaveId}/approve/`;
export const leaveRejectRoute = (leaveId) =>
  `${BASE_URL}/leaves/${leaveId}/reject/`;

// Complaint Management (HM-WF-102)
export const complaintsRoute = `${BASE_URL}/complaints/`;
export const complaintDetailRoute = (complaintId) =>
  `${BASE_URL}/complaints/${complaintId}/`;
export const complaintEscalateRoute = (complaintId) =>
  `${BASE_URL}/complaints/${complaintId}/escalate/`;
export const complaintResolveRoute = (complaintId) =>
  `${BASE_URL}/complaints/${complaintId}/resolve/`;

// Room Allocation (HM-WF-103)
export const roomAllocationsRoute = `${BASE_URL}/room-allocations/`;
export const roomAllocationDetailRoute = (allocationId) =>
  `${BASE_URL}/room-allocations/${allocationId}/`;
export const roomAllocationDeleteRoute = (allocationId) =>
  `${BASE_URL}/room-allocations/${allocationId}/delete/`;
export const bulkAllocateRoute = `${BASE_URL}/room-allocations/bulk-allocate/`;

// Room Changes (HM-WF-104)
export const roomChangesRoute = `${BASE_URL}/room-changes/`;
export const roomChangeDetailRoute = (changeId) =>
  `${BASE_URL}/room-changes/${changeId}/`;
export const roomChangeApproveRoute = (changeId) =>
  `${BASE_URL}/room-changes/${changeId}/approve/`;
export const roomChangeRejectRoute = (changeId) =>
  `${BASE_URL}/room-changes/${changeId}/reject/`;

// Fine Management (HM-WF-105)
export const finesRoute = `${BASE_URL}/fines/`;
export const fineDetailRoute = (fineId) => `${BASE_URL}/fines/${fineId}/`;
export const fineMarkPaidRoute = (fineId) =>
  `${BASE_URL}/fines/${fineId}/mark-paid/`;
export const fineWaiveRoute = (fineId) => `${BASE_URL}/fines/${fineId}/waive/`;

// Staff Scheduling (HM-WF-107)
export const schedulesRoute = `${BASE_URL}/schedules/`;
export const scheduleDetailRoute = (scheduleId) =>
  `${BASE_URL}/schedules/${scheduleId}/`;

// Inventory Management (HM-WF-108)
export const inventoryRoute = `${BASE_URL}/inventory/`;
export const inventoryDetailRoute = (inventoryId) =>
  `${BASE_URL}/inventory/${inventoryId}/`;

// Notice Board (HM-WF-110)
export const noticesRoute = `${BASE_URL}/notices/`;
export const noticeDetailRoute = (noticeId) =>
  `${BASE_URL}/notices/${noticeId}/`;

// Guest Room Booking (HM-WF-112)
export const guestBookingsRoute = `${BASE_URL}/guest-bookings/`;
export const guestBookingDetailRoute = (bookingId) =>
  `${BASE_URL}/guest-bookings/${bookingId}/`;
export const guestBookingApproveRoute = (bookingId) =>
  `${BASE_URL}/guest-bookings/${bookingId}/approve/`;
export const guestBookingRejectRoute = (bookingId) =>
  `${BASE_URL}/guest-bookings/${bookingId}/reject/`;
export const guestBookingCheckInRoute = (bookingId) =>
  `${BASE_URL}/guest-bookings/${bookingId}/check-in/`;
export const guestBookingCheckOutRoute = (bookingId) =>
  `${BASE_URL}/guest-bookings/${bookingId}/check-out/`;

// Batch Identification & Management
export const batchesRoute = `${host}/programme_curriculum/api/admin_batches/`;
export const batchDetailRoute = (batchId) =>
  `${host}/programme_curriculum/api/batches/${batchId}/`;
export const syncBatchRoute = `${host}/programme_curriculum/api/batches/sync/`;
export const listBatchesStatusRoute = `${host}/programme_curriculum/api/batches/list/`;
