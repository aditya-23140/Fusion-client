import React, { useState, useEffect, useCallback } from "react";
import { Title, Button, Card, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import NoticesTable from "./components/NoticesTable";
import CreateNoticeModal from "./components/CreateNoticeModal";
import { fetchNotices, createNotice, deleteNotice, fetchHalls } from "./api";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadNotices = useCallback(async () => {
    try {
      setLoading(true);
      const [noticesData, hallsData] = await Promise.all([
        fetchNotices(),
        fetchHalls(),
      ]);
      setNotices(noticesData);
      setHalls(hallsData);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to load notices",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const handleCreateNotice = async (formData) => {
    try {
      setSubmitting(true);
      await createNotice(formData);
      notifications.show({
        title: "Success",
        message: "Notice posted",
        color: "green",
      });
      setModalOpen(false);
      loadNotices();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to post",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (notice) => {
    if (!window.confirm("Delete?")) return;
    try {
      await deleteNotice(notice.id);
      notifications.show({
        title: "Success",
        message: "Notice deleted",
        color: "green",
      });
      loadNotices();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Notice Board</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
          Post Notice
        </Button>
      </Group>
      <NoticesTable notices={notices} loading={loading} onDelete={handleDeleteNotice} canDelete />
      <CreateNoticeModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateNotice}
        loading={submitting}
        halls={halls}
      />
    </Card>
  );
}
