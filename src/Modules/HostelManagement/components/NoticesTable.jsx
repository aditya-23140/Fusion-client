/**
 * NoticesTable Component
 * Displays list of hostel notices
 */

import React from "react";
import PropTypes from "prop-types";
import { ActionIcon, Tooltip, Anchor } from "@mantine/core";
import { IconTrash, IconDownload } from "@tabler/icons-react";
import DataTable from "./DataTable";
import { mediaRoute } from "../../../routes/globalRoutes";

export default function NoticesTable({
  notices,
  loading,
  onDelete,
  canDelete = false,
}) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "head_line", label: "Headline" },
    { key: "description", label: "Description" },
    {
      key: "hall_name",
      label: "Hall",
      render: (_, row) => row.hall?.hall_name || "-",
    },
    {
      key: "posted_by_name",
      label: "Posted By",
      render: (_, row) => row.posted_by?.user?.username || "-",
    },
    {
      key: "content",
      label: "Attachment",
      render: (value) =>
        value ? (
          <Anchor href={`${mediaRoute}${value}`} target="_blank">
            <IconDownload size={16} />
          </Anchor>
        ) : (
          "-"
        ),
    },
  ];

  if (canDelete) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <Tooltip label="Delete Notice">
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => onDelete?.(row)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      ),
    });
  }

  return (
    <DataTable
      columns={columns}
      data={notices}
      loading={loading}
      emptyMessage="No notices found"
    />
  );
}

NoticesTable.propTypes = {
  notices: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
  canDelete: PropTypes.bool,
};

NoticesTable.defaultProps = {
  loading: false,
  onDelete: null,
  canDelete: false,
};
