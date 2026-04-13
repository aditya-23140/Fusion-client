/**
 * Hostel Management Module Router
 * Entry point that handles all hostel management routes
 *
 * Supported Routes:
 * /hostel-management/                     - Main dashboard with tabs
 * /hostel-management/leave                - Leave Management (HM-WF-101)
 * /hostel-management/complaints           - Complaint Management (HM-WF-102)
 * /hostel-management/room-allocation      - Room Allocation (HM-WF-103)
 * /hostel-management/room-changes         - Room Changes (HM-WF-104)
 * /hostel-management/fines                - Fine Management (HM-WF-105)
 * /hostel-management/inventory            - Inventory (HM-WF-108)
 * /hostel-management/notices              - Notice Board (HM-WF-110)
 * /hostel-management/guest-rooms          - Guest Room Booking (HM-WF-112)
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HostelManagementPage from "./index";
import LeaveManagement from "./LeaveManagement";
import ComplaintManagement from "./ComplaintManagement";
import RoomAllocationManagement from "./RoomAllocationManagement";
import FineManagement from "./FineManagement";
import InventoryManagement from "./InventoryManagement";
import NoticeBoard from "./NoticeBoard";
import GuestRoomBookings from "./GuestRoomBookings";
import HallManagement from "./HallManagement";

export default function HostelManagement() {
  return (
    <Routes>
      <Route path="/" element={<HostelManagementPage />} />
      <Route path="/dashboard" element={<HostelManagementPage />} />
      <Route path="/leave/*" element={<LeaveManagement />} />
      <Route path="/complaints/*" element={<ComplaintManagement />} />
      <Route path="/room-allocation/*" element={<RoomAllocationManagement />} />
      <Route path="/room-changes/*" element={<RoomAllocationManagement />} />
      <Route path="/fines/*" element={<FineManagement />} />
      <Route path="/inventory/*" element={<InventoryManagement />} />
      <Route path="/notices/*" element={<NoticeBoard />} />
      <Route path="/guest-rooms/*" element={<GuestRoomBookings />} />
      <Route path="/halls/*" element={<HallManagement />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
