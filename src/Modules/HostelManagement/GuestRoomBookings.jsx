import React, { useState, useEffect, useCallback } from "react";
import { Title, Button, Card, Tabs, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import BookingsTable from "./components/BookingsTable";
import CreateBookingModal from "./components/CreateBookingModal";
import ApproveBookingModal from "./components/ApproveBookingModal";
import {
  fetchHalls,
  fetchBookings,
  fetchMyBookings,
  createBooking,
  approveBooking,
  rejectBooking,
} from "./api";

export default function GuestRoomBookings() {
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("my");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [bookingsData, myBookingsData, hallsData] = await Promise.all([
        fetchBookings(),
        fetchMyBookings(),
        fetchHalls(),
      ]);
      setBookings(bookingsData);
      setMyBookings(myBookingsData);
      setHalls(hallsData);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to load bookings",
        color: "red",
      });
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
        message: "Booking created",
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

  const handleApproveBooking = async (data) => {
    try {
      setSubmitting(true);
      await approveBooking(data);
      notifications.show({
        title: "Success",
        message: "Booking approved",
        color: "green",
      });
      setApproveModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectBooking = async (booking) => {
    if (!window.confirm("RejectBooking?")) return;
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
        message: err.response?.data?.error || "Failed",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Guest Room Bookings</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
          New Booking
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="my">My Bookings</Tabs.Tab>
          <Tabs.Tab value="all">All Bookings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="my">
          <BookingsTable bookings={myBookings} loading={loading} />
        </Tabs.Panel>

        <Tabs.Panel value="all">
          <BookingsTable
            bookings={bookings}
            loading={loading}
            showActions
            onApprove={(booking) => {
              setSelectedBooking(booking);
              setApproveModalOpen(true);
            }}
            onReject={handleRejectBooking}
          />
        </Tabs.Panel>
      </Tabs>

      <CreateBookingModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateBooking}
        loading={submitting}
        halls={halls}
      />

      {selectedBooking && (
        <ApproveBookingModal
          opened={approveModalOpen}
          onClose={() => setApproveModalOpen(false)}
          onSubmit={handleApproveBooking}
          loading={submitting}
          booking={selectedBooking}
        />
      )}
    </Card>
  );
}
