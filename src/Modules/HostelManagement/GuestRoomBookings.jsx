/**
 * GuestRoomBookings Feature
 * Manages guest room bookings
 */

import React, { useState, useEffect, useCallback } from "react";
import { Card, Title, Button, Group, Alert, Tabs } from "@mantine/core";
import {
  IconPlus,
  IconAlertCircle,
  IconList,
  IconUser,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import BookingsTable from "./components/BookingsTable";
import CreateBookingModal from "./components/CreateBookingModal";
import ApproveBookingModal from "./components/ApproveBookingModal";
import {
  fetchBookings,
  fetchMyBookings,
  createBooking,
  approveBooking,
  rejectBooking,
  fetchHalls,
} from "./api";

export default function GuestRoomBookings() {
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsData, myBookingsData, hallsData] = await Promise.all([
        fetchBookings(),
        fetchMyBookings(),
        fetchHalls(),
      ]);
      setBookings(bookingsData);
      setMyBookings(myBookingsData);
      setHalls(hallsData);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateBooking = async (formData) => {
    try {
      setSubmitting(true);
      await createBooking(formData);
      notifications.show({
        title: "Success",
        message: "Booking request submitted successfully",
        color: "green",
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to create booking",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleApproveBooking = (booking) => {
    // Open approval modal with selected booking
    setSelectedBooking(booking);
    setApprovalModalOpen(true);
  };

  const handleSubmitApproval = async (approvalData) => {
    try {
      setSubmitting(true);
      await approveBooking(approvalData);
      notifications.show({
        title: "Success",
        message: "Booking approved and room assigned successfully",
        color: "green",
      });
      setApprovalModalOpen(false);
      setSelectedBooking(null);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to approve booking",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectBooking = async (booking) => {
    try {
      await rejectBooking(booking.id);
      notifications.show({
        title: "Success",
        message: "Booking rejected",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to reject booking",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Guest Room Bookings</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          New Booking
        </Button>
      </Group>
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="all" leftSection={<IconList size={14} />}>
            All Bookings
          </Tabs.Tab>
          <Tabs.Tab value="my" leftSection={<IconUser size={14} />}>
            My Bookings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <BookingsTable
            bookings={bookings}
            loading={loading}
            showActions
            onApprove={handleApproveBooking}
            onReject={handleRejectBooking}
          />
        </Tabs.Panel>

        <Tabs.Panel value="my">
          <BookingsTable bookings={myBookings} loading={loading} />
        </Tabs.Panel>
      </Tabs>{" "}
      <CreateBookingModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateBooking}
        loading={submitting}
        halls={halls}
      />
      <ApproveBookingModal
        opened={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setSelectedBooking(null);
        }}
        onSubmit={handleSubmitApproval}
        loading={submitting}
        booking={selectedBooking}
      />
    </Card>
  );
}
