/**
 * GuestRoomBookings - Thin View
 * Manages guest room bookings
 * Orchestrates components and handles state, calls api.js
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  Title,
  Button,
  Group,
  Alert,
  Tabs,
  Stack,
  Badge,
} from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import GuestBookingCard from "./components/GuestBookingCard";
import GuestRoomBookingForm from "./components/GuestRoomBookingForm";
import ApproveGuestBookingModal from "./components/ApproveGuestBookingModal";
import {
  fetchGuestBookings,
  requestGuestBooking,
  rejectGuestBooking,
  checkInGuest,
  checkOutGuest,
} from "./api";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export default function GuestRoomBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const userRole = useSelector((state) => state.user.role);
  const userHallId = useSelector((state) => state.user.hallId); // Get user's hall
  const isStaff = userRole === "caretaker" || userRole === "warden";
  const isStudent = userRole === "student";

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const bookingsData = await fetchGuestBookings();
      setBookings(bookingsData);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const handleSubmitBooking = async (formData) => {
    try {
      setSubmitting(true);

      // Transform form data to match API expectations
      const bookingPayload = {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone,
        guest_address: formData.guest_address,
        nationality: formData.nationality || "",
        arrival_date: formData.arrival_date
          ? formData.arrival_date.toISOString().split("T")[0]
          : null,
        departure_date: formData.departure_date
          ? formData.departure_date.toISOString().split("T")[0]
          : null,
        purpose: formData.purpose,
        total_guests: formData.total_guests || 1,
        rooms_required: formData.rooms_required || 1,
        room_type: formData.room_type || "single",
      };

      // DEBUG: Log payload before sending
      console.log("🔍 [DEBUG] Guest Booking Payload:", bookingPayload);
      console.log("📤 Sending to /api/hostel/guest-bookings/");

      await requestGuestBooking(bookingPayload);
      notifications.show({
        title: "Success",
        message: "Guest booking request submitted",
        color: "green",
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to submit booking",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (booking) => {
    setSelectedBooking(booking);
    setApproveModalOpen(true);
  };

  const handleReject = async (booking) => {
    try {
      await rejectGuestBooking(booking.id);
      notifications.show({
        title: "Success",
        message: "Booking rejected",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to reject",
        color: "red",
      });
    }
  };

  const handleCheckIn = async (booking) => {
    try {
      await checkInGuest(booking.id);
      notifications.show({
        title: "Success",
        message: "Guest checked in",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to check in",
        color: "red",
      });
    }
  };

  const handleCheckOut = async (booking) => {
    try {
      await checkOutGuest(booking.id);
      notifications.show({
        title: "Success",
        message: "Guest checked out",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to check out",
        color: "red",
      });
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const approvedBookings = bookings.filter((b) => b.status === "approved");
  const checkedInBookings = bookings.filter((b) => b.status === "checked_in");
  const completedBookings = bookings.filter((b) => b.status === "checked_out");

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Guest Room Bookings</Title>
          {isStudent && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setModalOpen(true)}
            >
              Book Room
            </Button>
          )}
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="pending"
              rightSection={<Badge>{pendingBookings.length}</Badge>}
            >
              Pending
            </Tabs.Tab>
            <Tabs.Tab
              value="approved"
              rightSection={<Badge>{approvedBookings.length}</Badge>}
            >
              Approved
            </Tabs.Tab>
            <Tabs.Tab
              value="checked_in"
              rightSection={<Badge>{checkedInBookings.length}</Badge>}
            >
              Checked In
            </Tabs.Tab>
            <Tabs.Tab
              value="completed"
              rightSection={<Badge>{completedBookings.length}</Badge>}
            >
              Completed
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pending" pt="xl">
            <Stack gap="md">
              {pendingBookings.length === 0 ? (
                <Card withBorder p="xl">
                  <p>No pending bookings</p>
                </Card>
              ) : (
                pendingBookings.map((booking) => (
                  <GuestBookingCard
                    key={booking.id}
                    booking={booking}
                    onApprove={() => handleApprove(booking)}
                    onReject={() => handleReject(booking)}
                    canApprove={isStaff}
                    canReject={isStaff}
                    showActions={isStaff}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="approved" pt="xl">
            <Stack gap="md">
              {approvedBookings.length === 0 ? (
                <Card withBorder p="xl">
                  <p>No approved bookings</p>
                </Card>
              ) : (
                approvedBookings.map((booking) => (
                  <GuestBookingCard
                    key={booking.id}
                    booking={booking}
                    onCheckIn={() => handleCheckIn(booking)}
                    canCheckIn={isStaff}
                    showActions={isStaff}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="checked_in" pt="xl">
            <Stack gap="md">
              {checkedInBookings.length === 0 ? (
                <Card withBorder p="xl">
                  <p>No checked in guests</p>
                </Card>
              ) : (
                checkedInBookings.map((booking) => (
                  <GuestBookingCard
                    key={booking.id}
                    booking={booking}
                    onCheckOut={() => handleCheckOut(booking)}
                    canCheckOut={isStaff}
                    showActions={isStaff}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="completed" pt="xl">
            <Stack gap="md">
              {completedBookings.length === 0 ? (
                <Card withBorder p="xl">
                  <p>No completed bookings</p>
                </Card>
              ) : (
                completedBookings.map((booking) => (
                  <GuestBookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={false}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <GuestRoomBookingForm
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitBooking}
          loading={submitting}
        />

        <ApproveGuestBookingModal
          opened={approveModalOpen}
          onClose={() => {
            setApproveModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          hallId={userHallId}
          onApproveSuccess={() => {
            loadData();
            setApproveModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      </Stack>
    </Container>
  );
}
