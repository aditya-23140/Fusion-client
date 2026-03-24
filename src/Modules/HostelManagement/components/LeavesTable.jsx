/**
 * LeavesTable Component
 * Displays list of hostel leave requests
 */

import React from "react";
import PropTypes from "prop-types";
import { Badge, ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import DataTable from "./DataTable";

const statusColors = {
  pending: "yellow",
  Approved: "green",
  Rejected: "red",
};

const leaveShape = PropTypes.shape({
  id: PropTypes.number,
  student_name: PropTypes.string,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  reason: PropTypes.string,
  phone_number: PropTypes.string,
  status: PropTypes.string,
});

export default function LeavesTable({
  leaves,
  loading,
  onApprove,
  onReject,
  showActions = false,
}) {
  const columns = [
    { key: "id", label: "ID" },
    {
      key: "student_name",
      label: "Student",
      render: (_, row) => row.student_name || "-",
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (_, row) => row.start_date || "-",
    },
    {
      key: "end_date",
      label: "End Date",
      render: (_, row) => row.end_date || "-",
    },
    { key: "reason", label: "Reason", render: (_, row) => row.reason || "-" },
    {
      key: "phone_number",
      label: "Phone",
      render: (_, row) => row.phone_number || "-",
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
      render: (_, row) =>
        row.status === "pending" ? (
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
      data={leaves}
      loading={loading}
      emptyMessage="No leave requests found"
    />
  );
}

LeavesTable.propTypes = {
  leaves: PropTypes.arrayOf(leaveShape).isRequired,
  loading: PropTypes.bool.isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  showActions: PropTypes.bool,
};
