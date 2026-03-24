/**
 * DataTable Component
 * Reusable table component for displaying data
 */

import React from "react";
import PropTypes from "prop-types";
import { Table, Text, ScrollArea, Paper, Center, Loader } from "@mantine/core";

export default function DataTable({
  columns,
  data,
  loading,
  emptyMessage = "No data available",
}) {
  if (loading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">{emptyMessage}</Text>
      </Center>
    );
  }

  return (
    <Paper shadow="sm" radius="md" withBorder>
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.key}>{col.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row, index) => (
              <Table.Tr key={row.id || index}>
                {columns.map((col) => (
                  <Table.Td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

DataTable.defaultProps = {
  loading: false,
  emptyMessage: "No data available",
};
