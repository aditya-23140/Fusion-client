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
  Rejected: "red",
};

const fineShape = PropTypes.shape({
  fine_id: PropTypes.number,
  student_id_entered: PropTypes.string,
  student_id_display: PropTypes.string,
  student_name: PropTypes.string,
  hall_name: PropTypes.string,
  reason: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string,
});

export default function FinesTable({
  fines,
  loading,
  onEdit,
  onDelete,
  showActions = false,
}) {
  const columns = [
    { key: "fine_id", label: "ID" },
    {
      key: "student_id_display",
      label: "Student ID",
      render: (_, row) =>
        row.student_id_entered || row.student_id_display || "-",
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
      label: "Fine Reason",
      render: (_, row) => row.reason || "-",
    },
    {
      key: "amount",
      label: "Amount",
      render: (_, row) => `₹${row.amount || "0"}`,
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => (
        <Badge color={statusColors[row.status] || "gray"}>
          {row.status || "-"}
        </Badge>
      ),
    },
  ];

  if (showActions) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <Group gap="xs">
          <Tooltip label="Edit">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => onEdit?.(row)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
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
  fines: PropTypes.arrayOf(fineShape).isRequired,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
};
