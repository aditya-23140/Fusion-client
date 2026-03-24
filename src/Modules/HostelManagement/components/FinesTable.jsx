/**
 * FinesTable Component
 * Displays list of hostel fines
 */

import React from "react";
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
    { key: "id", label: "ID" },
    {
      key: "student_name",
      label: "Student",
      render: (_, row) => row.student?.id?.user?.username || "-",
    },
    {
      key: "hall_name",
      label: "Hall",
      render: (_, row) => row.hall?.hall_name || "-",
    },
    { key: "fine_type", label: "Fine Type" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `₹${value}`,
    },
    { key: "reason", label: "Reason" },
    { key: "date_issued", label: "Date Issued" },
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
