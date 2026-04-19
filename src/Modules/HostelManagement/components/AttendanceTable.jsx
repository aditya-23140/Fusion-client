/**
 * AttendanceTable Component
 * Displays student attendance records
 */

import React from "react";
import PropTypes from "prop-types";
import { Badge } from "@mantine/core";
import DataTable from "./DataTable";

function AttendanceTable({ attendance, loading }) {
  const columns = [
    { key: "id", label: "ID" },
    {
      key: "student_name",
      label: "Student",
      render: (_, row) =>
        row.student?.id?.user?.username || row.student_id || "-",
    },
    {
      key: "hall_name",
      label: "Hall",
      render: (_, row) => row.hall?.hall_name || "-",
    },
    { key: "date", label: "Date" },
    {
      key: "present",
      label: "Status",
      render: (value) => (
        <Badge color={value ? "green" : "red"}>
          {value ? "Present" : "Absent"}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={attendance}
      loading={loading}
      emptyMessage="No attendance records found"
    />
  );
}

AttendanceTable.propTypes = {
  attendance: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      student_id: PropTypes.string,
      date: PropTypes.string,
      present: PropTypes.bool,
    }),
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};
export default AttendanceTable;
