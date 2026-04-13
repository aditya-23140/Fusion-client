/**
 * ComplaintCard - Micro Component
 * Displays a single complaint with status and action buttons
 * Dumb component - receives data and callbacks from parent
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  Badge,
  Group,
  Stack,
  Text,
  Button,
  ActionIcon,
  Tooltip,
  ThemeIcon,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronRight,
  IconArrowNarrowUp,
  IconCheck,
} from "@tabler/icons-react";

const statusColors = {
  open: "blue",
  in_progress: "yellow",
  resolved: "green",
  closed: "gray",
};

const categoryColors = {
  maintenance: "purple",
  hygiene: "orange",
  noise: "red",
  behavior: "pink",
  other: "gray",
};

export default function ComplaintCard({
  complaint,
  onView,
  onEscalate,
  onResolve,
  canEscalate,
  canResolve,
  showActions = true,
}) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group align="flex-start">
            <ThemeIcon variant="light" size="lg" radius="md" color="red">
              <IconAlertCircle size={20} />
            </ThemeIcon>
            <Stack gap={4}>
              <Text fw={600} size="sm">
                Complaint #{complaint.id}
              </Text>
              <Text size="xs" c="dimmed">
                {new Date(complaint.created_at).toLocaleDateString()}
              </Text>
            </Stack>
          </Group>
          <Badge color={statusColors[complaint.status] || "gray"}>
            {complaint.status}
          </Badge>
        </Group>

        <Stack gap={4}>
          <Text size="sm" fw={500}>
            {complaint.title}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {complaint.description}
          </Text>
        </Stack>

        <Group gap="xs">
          <Badge
            size="sm"
            variant="light"
            color={categoryColors[complaint.category]}
          >
            {complaint.category}
          </Badge>
          {complaint.location && (
            <Badge size="sm" variant="light">
              {complaint.location}
            </Badge>
          )}
        </Group>

        {showActions && (
          <Group justify="flex-end" gap="xs">
            <Tooltip label="View Details">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => onView?.(complaint)}
              >
                <IconChevronRight size={18} />
              </ActionIcon>
            </Tooltip>
            {canEscalate && (
              <Tooltip label="Escalate">
                <ActionIcon
                  variant="light"
                  color="orange"
                  onClick={() => onEscalate?.(complaint)}
                >
                  <IconArrowNarrowUp size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            {canResolve && (
              <Tooltip label="Mark Resolved">
                <Button
                  size="xs"
                  color="green"
                  onClick={() => onResolve?.(complaint)}
                >
                  <IconCheck size={16} />
                  Resolve
                </Button>
              </Tooltip>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
}

ComplaintCard.propTypes = {
  complaint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    location: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onView: PropTypes.func,
  onEscalate: PropTypes.func,
  onResolve: PropTypes.func,
  canEscalate: PropTypes.bool,
  canResolve: PropTypes.bool,
  showActions: PropTypes.bool,
};
