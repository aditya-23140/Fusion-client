/**
 * Hostel Management Module
 * Main entry point with tab navigation
 * Role-based access:
 * - super_admin: Hall Creation, Warden/Caretaker Assignment, Batch Allocation
 * - warden: Leave, Complaints, Fines, Attendance, Bookings
 * - caretaker: Same as warden plus Halls & Rooms access
 * - student: Leave, Complaints, Fines, Bookings, Room Allocation, Vacation, Extended Stay
 */

import React, { useState, useEffect } from "react";
import { Flex, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumbs from "../../components/Breadcrumbs";
import ModuleTabs from "../../components/moduleTabs";
import { setActiveTab_ } from "../../redux/moduleslice";

// Feature Components
import HallManagement from "./HallManagement";
import StaffAssignment from "./StaffAssignment";
import GuestRoomBookings from "./GuestRoomBookings";
import NoticeBoard from "./NoticeBoard";
import LeaveManagement from "./LeaveManagement";
import ComplaintManagement from "./ComplaintManagement";
import FineManagement from "./FineManagement";
import InventoryManagement from "./InventoryManagement";
import AttendanceManagement from "./AttendanceManagement";
import RoomAllocationManagement from "./RoomAllocationManagement";

export default function HostelManagementPage() {
  const [activeTab, setActiveTab] = useState("0");
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.role);

  // Define tabs based on user role from Redux
  const getTabsAndComponents = () => {
    // SUPER ADMIN: Only Hall Creation, Warden/Caretaker Assignment, Batch Allocation
    if (userRole === "super_admin") {
      return {
        tabItems: [
          { title: "Hall Management" },
          { title: "Staff Assignment" },
          { title: "Batch Allocation" },
        ],
        tabComponents: [
          HallManagement,
          StaffAssignment,
          RoomAllocationManagement,
        ],
      };
    }

    // CARETAKER: Full access to hall management
    if (userRole === "caretaker") {
      return {
        tabItems: [
          { title: "Halls" },
          { title: "Guest Bookings" },
          { title: "Notice Board" },
          { title: "Leave Requests" },
          { title: "Complaints" },
          { title: "Fines" },
          { title: "Inventory" },
          { title: "Rooms" },
          { title: "Attendance" },
        ],
        tabComponents: [
          HallManagement,
          GuestRoomBookings,
          NoticeBoard,
          LeaveManagement,
          ComplaintManagement,
          FineManagement,
          InventoryManagement,
          RoomAllocationManagement,
          AttendanceManagement,
        ],
      };
    }

    // WARDEN: Limited access
    if (userRole === "warden") {
      return {
        tabItems: [
          { title: "Guest Bookings" },
          { title: "Notice Board" },
          { title: "Leave Requests" },
          { title: "Complaints" },
          { title: "Fines" },
          { title: "Attendance" },
        ],
        tabComponents: [
          GuestRoomBookings,
          NoticeBoard,
          LeaveManagement,
          ComplaintManagement,
          FineManagement,
          AttendanceManagement,
        ],
      };
    }

    // STUDENT: Personal features only
    return {
      tabItems: [
        { title: "Guest Bookings" },
        { title: "Notice Board" },
        { title: "Leave Requests" },
        { title: "Complaints" },
        { title: "Fines" },
        { title: "Room Allocation" },
      ],
      tabComponents: [
        GuestRoomBookings,
        NoticeBoard,
        LeaveManagement,
        ComplaintManagement,
        FineManagement,
        RoomAllocationManagement,
      ],
    };
  };

  const { tabItems, tabComponents } = getTabsAndComponents();

  useEffect(() => {
    if (tabItems && tabItems[parseInt(activeTab, 10)]) {
      dispatch(setActiveTab_(tabItems[parseInt(activeTab, 10)].title));
    }
  }, [activeTab, dispatch, tabItems]);

  const ActiveComponent =
    tabComponents[parseInt(activeTab, 10)] || tabComponents[0];

  return (
    <Flex direction="column" gap="md">
      <CustomBreadcrumbs />
      {userRole === "super_admin" && (
        <Alert icon={<IconAlertCircle />} color="blue" title="Super Admin Mode">
          You have access to hostel management administrative functions only:
          Hall Creation, Warden/Caretaker Assignment, and Batch Allocation.
        </Alert>
      )}

      <ModuleTabs
        tabs={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ActiveComponent />
    </Flex>
  );
}
