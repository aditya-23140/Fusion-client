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

function LeavesTable({
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
      render: (_, row) => row.student?.id?.user?.username || "-",
    },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "reason", label: "Reason" },
    { key: "address_during_leave", label: "Address" },
    { key: "phone", label: "Phone" },
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
  leaves: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool.isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  showActions: PropTypes.bool,
};

export default LeavesTable;
