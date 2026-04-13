/**
 * GuestBookingCard - Micro Component
 * Displays guest room booking information with status
 * Dumb component - receives data and callbacks from parent
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  Badge,
  Group,
  Stack,
  Text,
  Button,
  ThemeIcon,
  ActionIcon,
  Tooltip,
  Divider,
} from "@mantine/core";
import {
  IconUserCheck,
  IconCheck,
  IconX,
  IconChevronRight,
} from "@tabler/icons-react";

const statusColors = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
  checked_in: "blue",
  checked_out: "gray",
};

export default function GuestBookingCard({
  booking,
  onView,
  onApprove,
  onReject,
  onCheckIn,
  onCheckOut,
  canApprove = false,
  canReject = false,
  canCheckIn = false,
  canCheckOut = false,
  showActions = true,
}) {
  const isPending = booking.status === "pending";
  const isApproved = booking.status === "approved";
  const isCheckedIn = booking.status === "checked_in";

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group align="flex-start">
            <ThemeIcon variant="light" size="lg" radius="md" color="teal">
              <IconUserCheck size={20} />
            </ThemeIcon>
            <Stack gap={4}>
              <Text fw={600} size="sm">
                {booking.guest_name}
              </Text>
              <Text size="xs" c="dimmed">
                {booking.guest_email}
              </Text>
            </Stack>
          </Group>
          <Badge color={statusColors[booking.status] || "gray"}>
            {booking.status}
          </Badge>
        </Group>

        <Divider />

        <Group justify="space-between">
          <Stack gap={4}>
            <Text size="xs" fw={500} c="dimmed">
              Phone
            </Text>
            <Text size="sm">{booking.guest_phone}</Text>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" fw={500} c="dimmed">
              Room
            </Text>
            <Badge variant="light">
              {booking.room?.hall?.name} - Room {booking.room?.number}
            </Badge>
          </Stack>
        </Group>

        <Group justify="space-between">
          <Stack gap={4}>
            <Text size="xs" fw={500} c="dimmed">
              Check-in
            </Text>
            <Text size="sm">
              {new Date(booking.check_in_date).toLocaleDateString()}
            </Text>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" fw={500} c="dimmed">
              Check-out
            </Text>
            <Text size="sm">
              {new Date(booking.check_out_date).toLocaleDateString()}
            </Text>
          </Stack>
        </Group>

        <Stack gap={2}>
          <Text size="xs" fw={500} c="dimmed">
            Purpose
          </Text>
          <Text size="sm" c="dimmed">
            {booking.purpose}
          </Text>
        </Stack>

        {showActions && (
          <Group justify="flex-end" gap="xs" mt="md">
            <Tooltip label="View Details">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => onView?.(booking)}
              >
                <IconChevronRight size={18} />
              </ActionIcon>
            </Tooltip>

            {canApprove && isPending && (
              <Button
                size="xs"
                color="green"
                onClick={() => onApprove?.(booking)}
              >
                <IconCheck size={16} />
                Approve
              </Button>
            )}

            {canReject && isPending && (
              <Button
                size="xs"
                color="red"
                variant="light"
                onClick={() => onReject?.(booking)}
              >
                <IconX size={16} />
                Reject
              </Button>
            )}

            {canCheckIn && isApproved && (
              <Button
                size="xs"
                color="blue"
                onClick={() => onCheckIn?.(booking)}
              >
                Check In
              </Button>
            )}

            {canCheckOut && isCheckedIn && (
              <Button
                size="xs"
                color="gray"
                onClick={() => onCheckOut?.(booking)}
              >
                Check Out
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
}

GuestBookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.number.isRequired,
    guest_name: PropTypes.string.isRequired,
    guest_email: PropTypes.string.isRequired,
    guest_phone: PropTypes.string.isRequired,
    check_in_date: PropTypes.string.isRequired,
    check_out_date: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    room: PropTypes.shape({
      number: PropTypes.string,
      hall: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
  }).isRequired,
  onView: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onCheckIn: PropTypes.func,
  onCheckOut: PropTypes.func,
  canApprove: PropTypes.bool,
  canReject: PropTypes.bool,
  canCheckIn: PropTypes.bool,
  canCheckOut: PropTypes.bool,
  showActions: PropTypes.bool,
};
