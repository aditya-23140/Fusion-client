/**
 * NoticeBoard - Thin View
 * Manages notice board
 * Orchestrates components and handles state, calls api.js
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  Title,
  Button,
  Group,
  Alert,
  Stack,
  Badge,
  Modal,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import NoticeCard from "./components/NoticeCard";
import { fetchNotices, createNotice, deleteNotice } from "./api";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hallId] = useState(null);

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      priority: "medium",
      category: "",
    },
    validate: {
      title: (value) =>
        value && value.length >= 5
          ? null
          : "Title must be at least 5 characters",
      content: (value) =>
        value && value.length >= 20
          ? null
          : "Content must be at least 20 characters",
      priority: (value) => (value ? null : "Priority is required"),
    },
  });
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const noticesData = await fetchNotices();
      // Handle paginated response or direct array
      const noticesArray = Array.isArray(noticesData)
        ? noticesData
        : noticesData?.results || [];
      setNotices(noticesArray);
    } catch (err) {
      setError("Failed to load notices. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const handleCreateNotice = async (values) => {
    try {
      setSubmitting(true);
      // For warden/caretaker, use their assigned hall
      // For now, default to hall 1 if no hall ID is set
      const noticeHallId = hallId || 1;

      await createNotice({
        ...values,
        hall_id: noticeHallId,
      });
      notifications.show({
        title: "Success",
        message: "Notice posted successfully",
        color: "green",
      });
      form.reset();
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.error ||
          err.response?.data?.hall_id?.[0] ||
          "Failed to post notice",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (notice) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(notice.id);
        notifications.show({
          title: "Success",
          message: "Notice deleted",
          color: "green",
        });
        loadData();
      } catch (err) {
        notifications.show({
          title: "Error",
          message: err.response?.data?.error || "Failed to delete notice",
          color: "red",
        });
      }
    }
  };

  const highPriorityNotices = notices.filter((n) => n.priority === "high");
  const mediumPriorityNotices = notices.filter((n) => n.priority === "medium");
  const lowPriorityNotices = notices.filter((n) => n.priority === "low");

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Notice Board</Title>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setModalOpen(true)}
          >
            Post Notice
          </Button>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {loading ? (
          <Card withBorder p="xl">
            <p>Loading notices...</p>
          </Card>
        ) : notices.length === 0 ? (
          <Card withBorder p="xl">
            <p>No notices at the moment</p>
          </Card>
        ) : (
          <Stack gap="lg">
            {highPriorityNotices.length > 0 && (
              <Stack gap="md">
                <Group>
                  <Title order={4}>Important</Title>
                  <Badge color="red">{highPriorityNotices.length}</Badge>
                </Group>
                {highPriorityNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onDelete={() => handleDeleteNotice(notice)}
                    canDelete
                    showActions
                  />
                ))}
              </Stack>
            )}

            {mediumPriorityNotices.length > 0 && (
              <Stack gap="md">
                <Group>
                  <Title order={4}>Regular</Title>
                  <Badge color="yellow">{mediumPriorityNotices.length}</Badge>
                </Group>
                {mediumPriorityNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onDelete={() => handleDeleteNotice(notice)}
                    canDelete
                    showActions
                  />
                ))}
              </Stack>
            )}

            {lowPriorityNotices.length > 0 && (
              <Stack gap="md">
                <Group>
                  <Title order={4}>Updates</Title>
                  <Badge color="gray">{lowPriorityNotices.length}</Badge>
                </Group>{" "}
                {lowPriorityNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onDelete={() => handleDeleteNotice(notice)}
                    canDelete
                    showActions
                  />
                ))}
              </Stack>
            )}
          </Stack>
        )}

        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Post New Notice"
          centered
        >
          <form onSubmit={form.onSubmit(handleCreateNotice)}>
            <Stack gap="md">
              {" "}
              <TextInput
                label="Title"
                placeholder="Notice title"
                value={form.values.title}
                onChange={(e) =>
                  form.setFieldValue("title", e.currentTarget.value)
                }
                error={form.errors.title}
              />
              <Textarea
                label="Content"
                placeholder="Write your notice here"
                minRows={4}
                value={form.values.content}
                onChange={(e) =>
                  form.setFieldValue("content", e.currentTarget.value)
                }
                error={form.errors.content}
              />
              <Select
                label="Priority"
                data={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                value={form.values.priority}
                onChange={(value) => form.setFieldValue("priority", value)}
                error={form.errors.priority}
              />
              <TextInput
                label="Category"
                placeholder="e.g., Maintenance, Event, Alert"
                value={form.values.category}
                onChange={(e) =>
                  form.setFieldValue("category", e.currentTarget.value)
                }
                error={form.errors.category}
              />
              <Group justify="flex-end">
                <Button variant="default" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Post Notice
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Container>
  );
}
