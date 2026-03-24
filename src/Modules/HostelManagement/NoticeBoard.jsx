/**
 * NoticeBoard Feature
 * Manages hostel notices
 */

import React, { useState, useEffect, useCallback } from "react";
import { Flex, Title, Button, Alert } from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
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
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [noticesData, hallsData] = await Promise.all([
        fetchNotices(),
        fetchHalls(),
      ]);
      setNotices(noticesData);
      setHalls(hallsData);
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

  const handleCreateNotice = async (formData) => {
    try {
      setSubmitting(true);
      await createNotice(formData);
      notifications.show({
        title: "Success",
        message: "Notice created successfully",
        color: "green",
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to create notice",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (notice) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }
    try {
      await deleteNotice(notice.id);
      notifications.show({
        title: "Success",
        message: "Notice deleted successfully",
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
  };

  return (
    <Flex direction="column" gap="md">
      <Flex justify="space-between" align="center">
        <Title order={2}>Notice Board</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Create Notice
        </Button>
      </Flex>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      )}

      <NoticesTable
        notices={notices}
        loading={loading}
        canDelete
        onDelete={handleDeleteNotice}
      />

      <CreateNoticeModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateNotice}
        loading={submitting}
        halls={halls}
      />
    </Flex>
  );
}
