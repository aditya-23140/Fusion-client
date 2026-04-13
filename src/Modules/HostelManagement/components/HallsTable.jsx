/**
 * HallsTable Component
 * Displays list of halls with actions
 */

import React from "react";
import PropTypes from "prop-types";
import { Badge, ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconTrash, IconEye } from "@tabler/icons-react";
import DataTable from "./DataTable";

function HallsTable({ halls, loading, onDelete, onView }) {
  const columns = [
    { key: "hall_id", label: "Hall ID" },
    { key: "hall_name", label: "Hall Name" },
    { key: "max_accomodation", label: "Max Capacity" },
    { key: "number_students", label: "Current Students" },
    { key: "number_of_rooms", label: "Number of Rooms" },
    {
      key: "type_of_seater",
      label: "Seater Type",
      render: (value) => (
        <Badge
          color={
            value === "single"
              ? "blue"
              : value === "double"
                ? "green"
                : "orange"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <Group gap="xs">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => onView?.(row)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Hall">
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
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={halls}
      loading={loading}
      emptyMessage="No halls found"
    />
  );
}

HallsTable.propTypes = {
  halls: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default HallsTable;
