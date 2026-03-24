/**
 * Hostel Management Module
 * Main entry point with tab navigation
 */

import React, { useState, useEffect } from "react";
import { Flex, Loader, Center, Text } from "@mantine/core";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import CustomBreadcrumbs from "../../components/Breadcrumbs";
import ModuleTabs from "../../components/moduleTabs";
import { setActiveTab_ } from "../../redux/moduleslice";
import { fetchUserRole } from "./api";

// Feature Components
import HallManagement from "./HallManagement";
import GuestRoomBookings from "./GuestRoomBookings";
import NoticeBoard from "./NoticeBoard";
import LeaveManagement from "./LeaveManagement";
import ComplaintManagement from "./ComplaintManagement";
import FineManagement from "./FineManagement";
import InventoryManagement from "./InventoryManagement";
import RoomManagement from "./RoomManagement";
import AttendanceManagement from "./AttendanceManagement";

export default function HostelManagementPage() {
  const [activeTab, setActiveTab] = useState("0");
  const [hostelRole, setHostelRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Fetch user's hostel role on mount
  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const roleData = await fetchUserRole();
        setHostelRole(roleData);
      } catch (error) {
        console.error("Failed to fetch hostel role:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load user role",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };
    loadUserRole();
  }, []);

  // Define tabs based on hostel role
  const getTabsAndComponents = () => {
    const role = hostelRole?.role;

    if (role === "caretaker") {
      // Caretaker view - full access
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
          RoomManagement,
          AttendanceManagement,
        ],
      };
    } else if (role === "warden") {
      // Warden view
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
    } else {
      // Student view - limited access (default)
      return {
        tabItems: [
          { title: "Guest Bookings" },
          { title: "Notice Board" },
          { title: "My Leaves" },
          { title: "My Complaints" },
          { title: "My Fines" },
        ],
        tabComponents: [
          GuestRoomBookings,
          NoticeBoard,
          LeaveManagement,
          ComplaintManagement,
          FineManagement,
        ],
      };
    }
  };

  const { tabItems, tabComponents } = getTabsAndComponents();

  useEffect(() => {
    if (tabItems && tabItems[parseInt(activeTab, 10)]) {
      dispatch(setActiveTab_(tabItems[parseInt(activeTab, 10)].title));
    }
  }, [activeTab, dispatch, tabItems]);

  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  const ActiveComponent =
    tabComponents[parseInt(activeTab, 10)] || tabComponents[0];

  return (
    <Flex direction="column" gap="md">
      <CustomBreadcrumbs />
      {hostelRole?.hall_name && (
        <Text size="sm" c="dimmed">
          Hall: {hostelRole.hall_name}
        </Text>
      )}
      <ModuleTabs
        tabs={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ActiveComponent hostelRole={hostelRole} />
    </Flex>
  );
}
