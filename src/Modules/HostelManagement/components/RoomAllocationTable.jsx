/**
 * RoomAllocationTable - Micro Component
 * Displays room allocations in a structured table format
 * Dumb component - receives data and callbacks from parent
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  Badge,
  Group,
  ActionIcon,
  Tooltip,
  Text,
  Center,
  Stack,
  Loader,
} from "@mantine/core";
import { IconChevronRight, IconEdit } from "@tabler/icons-react";

const statusColors = {
  pending: "yellow",
  active: "green",
  completed: "gray",
  cancelled: "red",
};

export default function RoomAllocationTable({
  allocations,
  loading = false,
  onView,
  onEdit,
  showActions = true,
}) {
  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (!allocations || allocations.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">No room allocations found</Text>
      </Center>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Student</Table.Th>
            <Table.Th>Hall</Table.Th>
            <Table.Th>Room</Table.Th>
            <Table.Th>Allocated Date</Table.Th>
            <Table.Th>Status</Table.Th>
            {showActions && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {allocations.map((allocation) => (
            <Table.Tr key={allocation.id}>
              <Table.Td>
                <Stack gap={0}>
                  <Text fw={500} size="sm">
                    {allocation.student?.id?.user?.first_name}{" "}
                    {allocation.student?.id?.user?.last_name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {allocation.student?.id?.user?.username}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td>{allocation.room?.hall?.name || "-"}</Table.Td>
              <Table.Td>
                <Badge>{allocation.room?.number || "-"}</Badge>
              </Table.Td>
              <Table.Td>
                {new Date(allocation.allocated_date).toLocaleDateString()}
              </Table.Td>
              <Table.Td>
                <Badge color={statusColors[allocation.status] || "gray"}>
                  {allocation.status}
                </Badge>
              </Table.Td>
              {showActions && (
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="View">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        color="blue"
                        onClick={() => onView?.(allocation)}
                      >
                        <IconChevronRight size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        color="blue"
                        onClick={() => onEdit?.(allocation)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}

RoomAllocationTable.propTypes = {
  allocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      student: PropTypes.shape({
        id: PropTypes.shape({
          user: PropTypes.shape({
            first_name: PropTypes.string,
            last_name: PropTypes.string,
            username: PropTypes.string,
          }),
        }),
      }),
      room: PropTypes.shape({
        number: PropTypes.string,
        hall: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
      allocated_date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  loading: PropTypes.bool,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  showActions: PropTypes.bool,
};
