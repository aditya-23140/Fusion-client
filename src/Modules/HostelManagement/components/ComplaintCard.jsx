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
  submitted: "blue",
  under_review: "yellow",
  escalated: "orange",
  resolved: "green",
  closed: "gray",
};

const statusLabels = {
  submitted: "Submitted",
  under_review: "Under Review",
  escalated: "Escalated",
  resolved: "Resolved",
  closed: "Closed",
};

const categoryColors = {
  facility: "purple",
  food: "orange",
  security: "red",
  ragging: "pink",
  other: "gray",
};

const priorityColors = {
  low: "gray",
  medium: "blue",
  high: "orange",
  critical: "red",
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
            {statusLabels[complaint.status] || complaint.status}
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
          {complaint.priority && (
            <Badge
              size="sm"
              variant="light"
              color={priorityColors[complaint.priority] || "gray"}
            >
              {complaint.priority}
            </Badge>
          )}
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
    priority: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func,
  onEscalate: PropTypes.func,
  onResolve: PropTypes.func,
  canEscalate: PropTypes.bool,
  canResolve: PropTypes.bool,
  showActions: PropTypes.bool,
};
