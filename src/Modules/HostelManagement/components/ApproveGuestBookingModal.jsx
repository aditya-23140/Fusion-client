/**
 * ApproveGuestBookingModal - Micro Component
 * Modal for staff to approve guest room bookings with room assignment
 * Fetches available guest rooms in caretaker's hall and assigns with remarks
 */

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  Select,
  Textarea,
  Alert,
  Loader,
  Badge,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { fetchRoomsInHall, approveGuestBooking } from "../api";

export default function ApproveGuestBookingModal({
  opened,
  onClose,
  booking,
  hallId,
  onApproveSuccess,
}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAvailableRooms = useCallback(async () => {
    try {
      setRoomsLoading(true);
      setError(null);
      const roomsData = await fetchRoomsInHall(hallId);

      // Filter for available guest rooms (not currently occupied and capacity allows)
      const availableRooms = roomsData
        .filter((room) => room.status === "available" || room.is_vacant)
        .map((room) => ({
          value: room.id.toString(),
          label: `${room.room_number} (${room.room_type}) - Cap: ${room.capacity}`,
          room,
        }));

      setRooms(availableRooms);

      if (availableRooms.length === 0) {
        setError(
          "No available guest rooms in this hall for the booking period.",
        );
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      setError("Failed to load available rooms. Please try again.");
      notifications.show({
        title: "Error",
        message: "Failed to load available rooms",
        color: "red",
      });
    } finally {
      setRoomsLoading(false);
    }
  }, [hallId]);

  // Fetch available rooms when modal opens
  useEffect(() => {
    if (opened && hallId && booking) {
      loadAvailableRooms();
    }
  }, [opened, hallId, booking]);

  const handleApprove = async () => {
    try {
      if (!selectedRoom) {
        notifications.show({
          title: "Error",
          message: "Please select a room",
          color: "red",
        });
        return;
      }

      if (remarks.trim().length < 5) {
        notifications.show({
          title: "Error",
          message: "Please provide remarks (at least 5 characters)",
          color: "red",
        });
        return;
      }

      setLoading(true);

      const approvalData = {
        guest_room_id: parseInt(selectedRoom, 10),
        remarks: remarks.trim(),
      };

      await approveGuestBooking(booking.id, approvalData);

      notifications.show({
        title: "Success",
        message: "Guest booking approved successfully",
        color: "green",
      });

      onApproveSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to approve booking:", err);
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to approve booking",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Approve Guest Room Booking"
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Booking Summary */}
        <div>
          <Text fw={600} size="sm" mb="xs">
            Booking Details
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <div>
              <Text size="xs" c="dimmed">
                Guest Name
              </Text>
              <Text size="sm" fw={500}>
                {booking.guest_name}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Contact
              </Text>
              <Text size="sm" fw={500}>
                {booking.guest_phone}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Arrival Date
              </Text>
              <Text size="sm" fw={500}>
                {new Date(booking.arrival_date).toLocaleDateString()}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Departure Date
              </Text>
              <Text size="sm" fw={500}>
                {new Date(booking.departure_date).toLocaleDateString()}
              </Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Total Guests
              </Text>
              <Badge>{booking.total_guests}</Badge>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Purpose
              </Text>
              <Text size="sm" fw={500}>
                {booking.purpose.substring(0, 30)}...
              </Text>
            </div>
          </SimpleGrid>
        </div>

        <Divider />

        {/* Room Assignment Section */}
        <div>
          <Text fw={600} size="sm" mb="xs">
            Assign Guest Room
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle />} color="red" mb="md">
              {error}
            </Alert>
          )}

          {roomsLoading ? (
            <Group justify="center" p="md">
              <Loader size="sm" />
              <Text size="sm">Loading available rooms...</Text>
            </Group>
          ) : (
            <Select
              label="Select Available Room"
              placeholder="Choose a room for the guest"
              data={rooms}
              value={selectedRoom}
              onChange={setSelectedRoom}
              disabled={rooms.length === 0 || loading}
              searchable
              clearable
              required
            />
          )}
        </div>

        {/* Remarks Section */}
        <div>
          <Textarea
            label="Approval Remarks"
            placeholder="Add any remarks or special notes for this booking (minimum 5 characters)"
            minRows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.currentTarget.value)}
            disabled={loading}
            required
          />
          <Text size="xs" c="dimmed" mt={4}>
            {remarks.length} characters
          </Text>
        </div>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="xs" mt="lg">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleApprove}
            loading={loading}
            disabled={!selectedRoom || remarks.trim().length < 5}
          >
            Approve & Assign Room
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

ApproveGuestBookingModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  booking: PropTypes.shape({
    id: PropTypes.number.isRequired,
    guest_name: PropTypes.string.isRequired,
    guest_phone: PropTypes.string.isRequired,
    arrival_date: PropTypes.string.isRequired,
    departure_date: PropTypes.string.isRequired,
    total_guests: PropTypes.number.isRequired,
    purpose: PropTypes.string.isRequired,
  }),
  hallId: PropTypes.number,
  onApproveSuccess: PropTypes.func,
};
