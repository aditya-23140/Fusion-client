/**
 * ApproveBookingModal Component
 * Modal for approving a booking and assigning a guest room
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Stack,
  Group,
  Select,
  Text,
  Alert,
  Loader,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { fetchGuestRooms } from "../api";

export default function ApproveBookingModal({
  opened,
  onClose,
  onSubmit,
  loading,
  booking,
}) {
  const [guestRooms, setGuestRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomError, setRoomError] = useState(null);

  // Fetch available guest rooms when modal opens
  useEffect(() => {
    if (opened && booking) {
      loadGuestRooms();
    }
  }, [opened, booking]);

  const loadGuestRooms = async () => {
    try {
      setLoadingRooms(true);
      setRoomError(null);
      const rooms = await fetchGuestRooms(booking.hall);

      // Format rooms for Select component
      const roomOptions = rooms.map((room) => ({
        value: room.id.toString(),
        label: `Room ${room.room} (${room.room_type})`,
        ...room,
      }));

      setGuestRooms(roomOptions);

      // Auto-select first room if available
      if (roomOptions.length > 0) {
        setSelectedRoomId(roomOptions[0].value);
      }
    } catch (err) {
      setRoomError(
        err.response?.data?.error ||
          "Failed to load available rooms. Please try again.",
      );
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRoomId) {
      notifications.show({
        title: "Error",
        message: "Please select a room",
        color: "red",
      });
      return;
    }

    try {
      await onSubmit({
        booking_id: booking.id,
        guest_room_id: parseInt(selectedRoomId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!booking) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Approve Booking" size="md">
      <Stack gap="md">
        {/* Booking Details Summary */}
        <div
          style={{
            padding: "12px",
            backgroundColor: "#f5f5f5",
            borderRadius: "6px",
          }}
        >
          <Text size="sm" weight={500} mb="xs">
            Booking Details
          </Text>
          <Group justify="space-between" mb="xs">
            <Text size="sm">Guest Name:</Text>
            <Text size="sm" weight={500}>
              {booking.guest_name}
            </Text>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text size="sm">Phone:</Text>
            <Text size="sm" weight={500}>
              {booking.guest_phone}
            </Text>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text size="sm">Guests:</Text>
            <Text size="sm" weight={500}>
              {booking.total_guest}
            </Text>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text size="sm">Rooms Required:</Text>
            <Text size="sm" weight={500}>
              {booking.rooms_required}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Check-in:</Text>
            <Text size="sm" weight={500}>
              {booking.arrival_date}
            </Text>
          </Group>
        </div>

        {/* Room Selection */}
        {roomError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            title="Error loading rooms"
          >
            {roomError}
          </Alert>
        )}

        {loadingRooms ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <Loader size="sm" />
          </div>
        ) : guestRooms.length > 0 ? (
          <Select
            label="Assign Guest Room"
            placeholder="Select a room"
            data={guestRooms}
            value={selectedRoomId}
            onChange={setSelectedRoomId}
            required
            searchable
          />
        ) : (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="yellow"
            title="No available rooms"
          >
            There are no available rooms to assign for this booking.
          </Alert>
        )}

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!selectedRoomId || guestRooms.length === 0}
          >
            Approve & Assign Room
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

ApproveBookingModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  booking: PropTypes.shape({
    id: PropTypes.number,
    guest_name: PropTypes.string,
    guest_phone: PropTypes.string,
    total_guest: PropTypes.number,
    rooms_required: PropTypes.number,
    arrival_date: PropTypes.string,
    hall: PropTypes.number,
  }),
};

ApproveBookingModal.defaultProps = {
  loading: false,
  booking: null,
};
