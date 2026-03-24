/**
 * RoomsTable Component
 * Displays list of hall rooms
 */

import React from "react";
import PropTypes from "prop-types";
import { Badge } from "@mantine/core";
import DataTable from "./DataTable";

const statusColors = {
  Booked: "blue",
  CheckedIn: "green",
  Available: "teal",
  UnderMaintenance: "orange",
};

export default function RoomsTable({ rooms, loading }) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "room_no", label: "Room No" },
    {
      key: "hall_name",
      label: "Hall",
      render: (_, row) => row.hall?.hall_name || "-",
    },
    { key: "room_cap", label: "Capacity" },
    { key: "current_occupancy", label: "Current Occupancy" },
    {
      key: "room_status",
      label: "Status",
      render: (value) => (
        <Badge color={statusColors[value] || "gray"}>{value}</Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rooms}
      loading={loading}
      emptyMessage="No rooms found"
    />
  );
}

RoomsTable.propTypes = {
  rooms: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

RoomsTable.defaultProps = {
  loading: false,
};
