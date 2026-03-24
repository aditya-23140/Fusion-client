/**
 * FinesTable Component
 * Displays list of hostel fines
 */

import React from "react";
import PropTypes from "prop-types";
import { Badge, ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import DataTable from "./DataTable";

const statusColors = {
  Pending: "yellow",
  Paid: "green",
};

export default function FinesTable({
  fines,
  loading,
  onEdit,
  onDelete,
  showActions = false,
}) {
  const columns = [
    { key: "fine_id", label: "Fine ID" },
    {
      key: "student_id_display",
      label: "Student ID",
      render: (_, row) => row.student_id_display || row.student_roll_no || "-",
    },
    {
      key: "student_name",
      label: "Student Name",
      render: (_, row) => row.student_name || "-",
    },
    {
      key: "hall_name",
      label: "Hall",
      render: (_, row) => row.hall_name || "-",
    },
    {
      key: "reason",
      label: "Reason",
      render: (value) => value || "-",
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `₹${value}`,
    },
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
      render: (_, row) => (
        <Group gap="xs">
          <Tooltip label="Edit Fine">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => onEdit?.(row)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Fine">
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => onDelete?.(row)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    });
  }

  return (
    <DataTable
      columns={columns}
      data={fines}
      loading={loading}
      emptyMessage="No fines found"
    />
  );
}

FinesTable.propTypes = {
  fines: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
};

FinesTable.defaultProps = {
  loading: false,
  onEdit: null,
  onDelete: null,
  showActions: false,
};
