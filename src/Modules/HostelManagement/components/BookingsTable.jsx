/**
 * BookingsTable Component
 * Displays list of guest room bookings
 */

import React from "react";
import PropTypes from "prop-types";
import { Badge, ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import DataTable from "./DataTable";

const statusColors = {
  Confirmed: "green",
  Pending: "yellow",
  Rejected: "red",
  Canceled: "gray",
  CancelRequested: "orange",
  CheckedIn: "blue",
  Complete: "teal",
  Forward: "indigo",
};

export default function BookingsTable({
  bookings,
  loading,
  onApprove,
  onReject,
  showActions = false,
}) {
  const columns = [
    { key: "id", label: "Booking ID" },
    { key: "guest_name", label: "Guest Name" },
    { key: "guest_phone", label: "Phone" },
    { key: "total_guest", label: "Guests" },
    { key: "rooms_required", label: "Rooms" },
    { key: "arrival_date", label: "Arrival Date" },
    { key: "departure_date", label: "Departure Date" },
    { key: "purpose", label: "Purpose" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge color={statusColors[value] || "gray"}>{value}</Badge>
      ),
    },
  ];

  if (showActions) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (_, row) =>
        row.status === "Pending" ? (
          <Group gap="xs">
            <Tooltip label="Approve">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() => onApprove?.(row)}
              >
                <IconCheck size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Reject">
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => onReject?.(row)}
              >
                <IconX size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : null,
    });
  }

  return (
    <DataTable
      columns={columns}
      data={bookings}
      loading={loading}
      emptyMessage="No bookings found"
    />
  );
}

BookingsTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  showActions: PropTypes.bool,
};

BookingsTable.defaultProps = {
  loading: false,
  onApprove: null,
  onReject: null,
  showActions: false,
};
