/**
 * NoticeCard - Micro Component
 * Displays a single notice from the notice board
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
  ThemeIcon,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconBellRinging,
  IconChevronRight,
  IconTrash,
} from "@tabler/icons-react";

const priorityColors = {
  low: "gray",
  medium: "yellow",
  high: "red",
};

export default function NoticeCard({
  notice,
  onView,
  onDelete,
  canDelete = false,
  showActions = true,
}) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group align="flex-start">
            <ThemeIcon variant="light" size="lg" radius="md" color="blue">
              <IconBellRinging size={20} />
            </ThemeIcon>
            <Stack gap={4}>
              <Text fw={600} size="sm">
                {notice.title}
              </Text>
              <Text size="xs" c="dimmed">
                Posted on {new Date(notice.created_at).toLocaleDateString()}
              </Text>
            </Stack>
          </Group>
          <Badge color={priorityColors[notice.priority] || "gray"}>
            {notice.priority}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={3}>
          {notice.content}
        </Text>

        {notice.category && (
          <Badge size="sm" variant="light">
            {notice.category}
          </Badge>
        )}

        {showActions && (
          <Group justify="flex-end" gap="xs">
            <Tooltip label="View Full Notice">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => onView?.(notice)}
              >
                <IconChevronRight size={18} />
              </ActionIcon>
            </Tooltip>
            {canDelete && (
              <Tooltip label="Delete">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => onDelete?.(notice)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
}

NoticeCard.propTypes = {
  notice: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    priority: PropTypes.string,
    category: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  canDelete: PropTypes.bool,
  showActions: PropTypes.bool,
};
