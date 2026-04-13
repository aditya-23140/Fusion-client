/**
 * Hostel Management API Service
 * Axios instance and centralized API calls for the hostel management module
 *
 * CRITICAL RULES:
 * - This is the SINGLE SOURCE OF TRUTH for backend communication
 * - All API callsexport const fetchRoomAllocations = async () => {
  const response = await apiClient.get(roomAllocationsRoute);
  return response.data;
};

export const fetchRoomAllocationDetail = async (allocationId) => {
  const response = await apiClient.get(roomAllocationDetailRoute(allocationId));
  return response.data;
};

export const deleteRoomAllocation = async (allocationId) => {
  const response = await apiClient.delete(
    roomAllocationDeleteRoute(allocationId)
  );
  return response.data;
};

export const bulkAllocateRooms = async (allocationsData) => {
  const response = await apiClient.post(bulkAllocateRoute, {
    allocations: allocationsData,
  });
  return response.data;
}; this service
 * - Request/Response interceptors handle auth tokens and errors
 * - No direct axios calls in components - use these methods
 */

import axios from "axios";
import {
  // Hall Management
  hallsRoute,
  hallDetailRoute,
  // Leave Management (HM-WF-101)
  leavesRoute,
  leaveDetailRoute,
  leaveApproveRoute,
  leaveRejectRoute,
  // Complaint Management (HM-WF-102)
  complaintsRoute,
  complaintDetailRoute,
  complaintEscalateRoute,
  complaintResolveRoute,
  // Room Allocation (HM-WF-103)
  roomAllocationsRoute,
  roomAllocationDetailRoute,
  roomAllocationDeleteRoute,
  bulkAllocateRoute,
  // Room Changes (HM-WF-104)
  roomChangesRoute,
  roomChangeDetailRoute,
  roomChangeApproveRoute,
  roomChangeRejectRoute,
  // Fine Management (HM-WF-105)
  finesRoute,
  fineDetailRoute,
  fineMarkPaidRoute,
  fineWaiveRoute,
  // Staff Scheduling (HM-WF-107)
  schedulesRoute,
  scheduleDetailRoute,
  // Inventory Management (HM-WF-108)
  inventoryRoute,
  inventoryDetailRoute,
  // Attendance Management
  listAttendanceRoute,
  // Notice Board (HM-WF-110)
  noticesRoute,
  noticeDetailRoute,
  // Guest Room Booking (HM-WF-112)
  guestBookingsRoute,
  guestBookingDetailRoute,
  guestBookingApproveRoute,
  guestBookingRejectRoute,
  guestBookingCheckInRoute,
  guestBookingCheckOutRoute,
  // Batch Identification & Management
  syncBatchRoute,
  // Hall Room Routes
  hallRoomsRoute,
  // Super Admin Routes
  assignWardenRoute,
  assignCaretakerRoute,
  facultyListRoute,
  staffListRoute,
  allocateBatchRoute,
  activeBatchYearsRoute,
  roomRenameRoute,
} from "../../routes/hostelManagementRoutes";

// ══════════════════════════════════════════════════════════════
// AXIOS INSTANCE & INTERCEPTORS
// ══════════════════════════════════════════════════════════════

const getAuthToken = () => localStorage.getItem("authToken");

const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/accounts/login";
    }
    return Promise.reject(error);
  },
);

// ══════════════════════════════════════════════════════════════
// HM-WF-101: LEAVE MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

export const submitLeave = async (leaveData) => {
  const response = await apiClient.post(leavesRoute, leaveData);
  return response.data;
};

// Alias for consistency with component imports
export const createLeave = submitLeave;

export const fetchLeaves = async () => {
  const response = await apiClient.get(leavesRoute);
  return response.data;
};

export const fetchMyLeaves = async () => {
  // Assuming backend supports /leaves/my/ endpoint, otherwise fetch all and filter
  try {
    const response = await apiClient.get(`${leavesRoute}my/`);
    return response.data;
  } catch (error) {
    // Fallback: fetch all leaves
    return fetchLeaves();
  }
};

export const fetchLeaveDetail = async (leaveId) => {
  const response = await apiClient.get(leaveDetailRoute(leaveId));
  return response.data;
};

export const approveLeave = async (leaveId, data) => {
  const response = await apiClient.post(leaveApproveRoute(leaveId), data);
  return response.data;
};

export const rejectLeave = async (leaveId, data) => {
  const response = await apiClient.post(leaveRejectRoute(leaveId), data);
  return response.data;
};

export const updateLeaveStatus = async (leaveId, status, data) => {
  // Route to update leave status (approve/reject based on status)
  if (status === "approved") {
    return approveLeave(leaveId, data);
  }
  if (status === "rejected") {
    return rejectLeave(leaveId, data);
  }
  throw new Error("Invalid leave status");
};

// ══════════════════════════════════════════════════════════════
// HM-WF-102: COMPLAINT MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

export const submitComplaint = async (complaintData) => {
  const response = await apiClient.post(complaintsRoute, complaintData);
  return response.data;
};

export const fetchComplaints = async () => {
  const response = await apiClient.get(complaintsRoute);
  return response.data;
};

export const fetchComplaintDetail = async (complaintId) => {
  const response = await apiClient.get(complaintDetailRoute(complaintId));
  return response.data;
};

export const updateComplaint = async (complaintId, data) => {
  const response = await apiClient.put(complaintDetailRoute(complaintId), data);
  return response.data;
};

export const escalateComplaint = async (complaintId, data) => {
  const response = await apiClient.post(
    complaintEscalateRoute(complaintId),
    data,
  );
  return response.data;
};

export const resolveComplaint = async (complaintId, data) => {
  const response = await apiClient.post(
    complaintResolveRoute(complaintId),
    data,
  );
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HM-WF-103: ROOM ALLOCATION API CALLS
// ══════════════════════════════════════════════════════════════
// HM-WF-103: ROOM ALLOCATION API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchRoomAllocations = async (params = {}) => {
  const { page = 1, page_size = 50 } = params;
  const response = await apiClient.get(roomAllocationsRoute, {
    params: { page, page_size },
  });
  return response.data;
};

export const fetchRoomAllocationDetail = async (allocationId) => {
  const response = await apiClient.get(roomAllocationDetailRoute(allocationId));
  return response.data;
};

export const deleteRoomAllocation = async (allocationId) => {
  const response = await apiClient.delete(
    roomAllocationDeleteRoute(allocationId),
  );
  return response.data;
};

export const bulkAllocateRooms = async (allocationsData) => {
  const response = await apiClient.post(bulkAllocateRoute, {
    allocations: allocationsData,
  });
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HM-WF-104: ROOM CHANGE API CALLS
// ══════════════════════════════════════════════════════════════

export const requestRoomChange = async (changeData) => {
  const response = await apiClient.post(roomChangesRoute, changeData);
  return response.data;
};

export const fetchRoomChanges = async () => {
  const response = await apiClient.get(roomChangesRoute);
  return response.data;
};

export const fetchRoomChangeDetail = async (changeId) => {
  const response = await apiClient.get(roomChangeDetailRoute(changeId));
  return response.data;
};

export const approveRoomChange = async (changeId, data) => {
  const response = await apiClient.post(roomChangeApproveRoute(changeId), data);
  return response.data;
};

export const rejectRoomChange = async (changeId, data) => {
  const response = await apiClient.post(roomChangeRejectRoute(changeId), data);
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HM-WF-105: FINE MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

export const imposeFine = async (fineData) => {
  const response = await apiClient.post(finesRoute, fineData);
  return response.data;
};

export const fetchFines = async () => {
  const response = await apiClient.get(finesRoute);
  return response.data;
};

export const fetchFineDetail = async (fineId) => {
  const response = await apiClient.get(fineDetailRoute(fineId));
  return response.data;
};

export const markFinePaid = async (fineId, data) => {
  const response = await apiClient.post(fineMarkPaidRoute(fineId), data);
  return response.data;
};

export const waiveFine = async (fineId, data) => {
  const response = await apiClient.post(fineWaiveRoute(fineId), data);
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HM-WF-107: STAFF SCHEDULING API CALLS
// ══════════════════════════════════════════════════════════════

export const createSchedule = async (scheduleData) => {
  const response = await apiClient.post(schedulesRoute, scheduleData);
  return response.data;
};

export const fetchSchedules = async () => {
  const response = await apiClient.get(schedulesRoute);
  return response.data;
};

export const fetchScheduleDetail = async (scheduleId) => {
  const response = await apiClient.get(scheduleDetailRoute(scheduleId));
  return response.data;
};

export const updateSchedule = async (scheduleId, data) => {
  const response = await apiClient.put(scheduleDetailRoute(scheduleId), data);
  return response.data;
};

export const deleteSchedule = async (scheduleId) => {
  const response = await apiClient.delete(scheduleDetailRoute(scheduleId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HM-WF-108: INVENTORY MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

export const createInventory = async (inventoryData) => {
  const response = await apiClient.post(inventoryRoute, inventoryData);
  return response.data;
};

export const fetchInventory = async () => {
  const response = await apiClient.get(inventoryRoute);
  return response.data;
};

export const fetchInventoryDetail = async (inventoryId) => {
  const response = await apiClient.get(inventoryDetailRoute(inventoryId));
  return response.data;
};

export const updateInventory = async (inventoryId, data) => {
  const response = await apiClient.put(inventoryDetailRoute(inventoryId), data);
  return response.data;
};

export const deleteInventory = async (inventoryId) => {
  const response = await apiClient.delete(inventoryDetailRoute(inventoryId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HM-WF-110: NOTICE BOARD API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchNotices = async () => {
  const response = await apiClient.get(noticesRoute);
  return response.data;
};

export const fetchNoticeDetail = async (noticeId) => {
  const response = await apiClient.get(noticeDetailRoute(noticeId));
  return response.data;
};

export const createNotice = async (noticeData) => {
  const response = await apiClient.post(noticesRoute, noticeData);
  return response.data;
};

export const updateNotice = async (noticeId, data) => {
  const response = await apiClient.put(noticeDetailRoute(noticeId), data);
  return response.data;
};

export const deleteNotice = async (noticeId) => {
  const response = await apiClient.delete(noticeDetailRoute(noticeId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HM-WF-112: GUEST ROOM BOOKING API CALLS
// ══════════════════════════════════════════════════════════════

export const requestGuestBooking = async (bookingData) => {
  const response = await apiClient.post(guestBookingsRoute, bookingData);
  return response.data;
};

export const fetchGuestBookings = async () => {
  const response = await apiClient.get(guestBookingsRoute);
  return response.data;
};

export const fetchGuestBookingDetail = async (bookingId) => {
  const response = await apiClient.get(guestBookingDetailRoute(bookingId));
  return response.data;
};

export const updateGuestBooking = async (bookingId, data) => {
  const response = await apiClient.put(
    guestBookingDetailRoute(bookingId),
    data,
  );
  return response.data;
};

export const approveGuestBooking = async (bookingId, data) => {
  const response = await apiClient.post(
    guestBookingApproveRoute(bookingId),
    data,
  );
  return response.data;
};

export const rejectGuestBooking = async (bookingId, data) => {
  const response = await apiClient.post(
    guestBookingRejectRoute(bookingId),
    data,
  );
  return response.data;
};

export const checkInGuest = async (bookingId, data) => {
  const response = await apiClient.post(
    guestBookingCheckInRoute(bookingId),
    data,
  );
  return response.data;
};

export const checkOutGuest = async (bookingId, data) => {
  const response = await apiClient.post(
    guestBookingCheckOutRoute(bookingId),
    data,
  );
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HALL MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

export const fetchHalls = async () => {
  const response = await apiClient.get(hallsRoute);
  return response.data;
};

export const fetchHallDetail = async (hallId) => {
  const response = await apiClient.get(hallDetailRoute(hallId));
  return response.data;
};

export const createHall = async (hallData) => {
  const response = await apiClient.post(hallsRoute, hallData);
  return response.data;
};

export const updateHall = async (hallId, data) => {
  const response = await apiClient.put(hallDetailRoute(hallId), data);
  return response.data;
};

export const deleteHall = async (hallId) => {
  const response = await apiClient.delete(hallDetailRoute(hallId));
  return response.data;
};

// ══════════════════════════════════════════════════════════════
// HALL ROOM MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

/**
 * Create a new room in a hall
 * @param {number} hallId - The ID of the hall
 * @param {Object} roomData - Room data (room_number, block_number, room_type, capacity)
 * @returns {Promise<Object>} Created room object
 */
export const createRoomInHall = async (hallId, roomData) => {
  try {
    const response = await apiClient.post(hallRoomsRoute(hallId), roomData);
    return response.data;
  } catch (error) {
    console.error(`Failed to create room in hall ${hallId}:`, error);
    throw error;
  }
};

/**
 * Fetch all rooms in a specific hall
 * @param {number} hallId - The ID of the hall
 * @returns {Promise<Array>} Array of room objects
 */
export const fetchRoomsInHall = async (hallId) => {
  try {
    const response = await apiClient.get(hallRoomsRoute(hallId));
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch rooms for hall ${hallId}:`, error);
    throw error;
  }
};

// ══════════════════════════════════════════════════════════════
// ATTENDANCE MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

/**
 * Fetch attendance records for a specific hall
 * @param {number|string} hallId - The ID of the hall
 * @returns {Promise<Array>} Array of attendance records for the hall
 */
export const fetchAttendance = async (hallId) => {
  try {
    const response = await apiClient.get(listAttendanceRoute(hallId));
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch attendance for hall ${hallId}:`, error);
    throw error;
  }
};

// ══════════════════════════════════════════════════════════════
// BATCH IDENTIFICATION & MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

/**
 * Fetch all running batches (active batches including PG)
 * Uses /programme_curriculum/api/batches/sync/ endpoint instead of /admin_batches/
 * because sync endpoint doesn't require 'acadadmin' role
 * Returns all active academic batches that can be used for room allocation
 * Normalizes batch_id → id for component compatibility
 * @returns {Promise<Array>} Array of batch objects with name, discipline, year, capacity info
 */
export const fetchAllActiveBatches = async () => {
  try {
    const response = await apiClient.get(syncBatchRoute);
    // Extract batches from response (sync endpoint returns { success, batches: [] })
    if (response.data && response.data.batches) {
      // Normalize batch data: map batch_id to id for component compatibility
      return response.data.batches.map((batch) => ({
        ...batch,
        id: batch.batch_id, // Normalize: sync endpoint uses batch_id, components expect id
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch active batches from sync endpoint:", error);
    // Log the error status for debugging
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error message:", error.response.data);
    }
    throw error;
  }
};

// ══════════════════════════════════════════════════════════════
// SUPER ADMIN MANAGEMENT API CALLS
// ══════════════════════════════════════════════════════════════

/**
 * Get all faculty members for warden assignment
 * @returns {Promise<Array>} Array of faculty members
 */
export const fetchFacultyList = async () => {
  try {
    const response = await apiClient.get(facultyListRoute);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch faculty list:", error);
    throw error;
  }
};

/**
 * Get all staff members for caretaker assignment
 * @returns {Promise<Array>} Array of staff members
 */
export const fetchStaffList = async () => {
  try {
    const response = await apiClient.get(staffListRoute);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch staff list:", error);
    throw error;
  }
};

/**
 * Assign a warden to a hall (Super Admin only)
 * @param {number} hallId - The ID of the hall
 * @param {number} facultyId - The ID of the faculty to assign as warden
 * @returns {Promise<Object>} Assignment result with warden_id
 */
export const assignWarden = async (hallId, facultyId) => {
  try {
    const response = await apiClient.post(assignWardenRoute, {
      hall_id: hallId,
      faculty_id: facultyId,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to assign warden to hall ${hallId}:`, error);
    throw error;
  }
};

/**
 * Assign a caretaker to a hall (Super Admin only)
 * @param {number} hallId - The ID of the hall
 * @param {number} staffId - The ID of the staff to assign as caretaker
 * @returns {Promise<Object>} Assignment result with caretaker_id
 */
export const assignCaretaker = async (hallId, staffId) => {
  try {
    const response = await apiClient.post(assignCaretakerRoute, {
      hall_id: hallId,
      staff_id: staffId,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to assign caretaker to hall ${hallId}:`, error);
    throw error;
  }
};

/**
 * Allocate an academic batch to a hall (Super Admin only)
 * @param {number} hallId - The ID of the hall
 * @param {number} batchId - The ID of the batch to allocate
 * @returns {Promise<Object>} Allocation result
 */
export const allocateBatch = async (hallId, batchId) => {
  try {
    const response = await apiClient.post(allocateBatchRoute, {
      hall_id: hallId,
      batch_id: batchId,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to allocate batch to hall ${hallId}:`, error);
    throw error;
  }
};

/**
 * Get all active batch years for assignment (Super Admin only)
 * @returns {Promise<Array>} Array of active batch years
 */
export const getActiveBatchYears = async () => {
  try {
    const response = await apiClient.get(activeBatchYearsRoute);
    return response.data.batches || [];
  } catch (error) {
    console.error("Failed to fetch active batch years:", error);
    throw error;
  }
};

/**
 * Rename a room in a hall (Warden/Caretaker can rename rooms)
 * @param {number} roomId - The ID of the room to rename
 * @param {string} newRoomNumber - The new room number (e.g., 'A101')
 * @param {string} newBlockNumber - The new block number (optional, e.g., 'A')
 * @returns {Promise<Object>} Updated room object
 */
export const renameRoom = async (
  roomId,
  newRoomNumber,
  newBlockNumber = null,
) => {
  try {
    const payload = { room_number: newRoomNumber };
    if (newBlockNumber) {
      payload.block_number = newBlockNumber;
    }
    const response = await apiClient.patch(roomRenameRoute(roomId), payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to rename room ${roomId}:`, error);
    throw error;
  }
};

export default apiClient;
