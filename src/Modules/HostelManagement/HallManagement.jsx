/**
 * HallManagement Feature
 * Manages halls, caretakers, and wardens
 */

import React, { useState, useEffect, useCallback } from "react";
import { Card, Title, Button, Group, Alert } from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import HallsTable from "./components/HallsTable";
import CreateHallModal from "./components/CreateHallModal";
import { fetchHalls, createHall, deleteHall, updateHallStatus } from "./api";

export default function HallManagement() {
  const userRole = useSelector((state) => state.user.role);
  const isSuperAdmin = userRole === "super_admin";

  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadHalls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHalls();
      setHalls(data);
    } catch (err) {
      setError("Failed to load halls. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHalls();
  }, [loadHalls]);

  const handleCreateHall = async (formData) => {
    try {
      setSubmitting(true);
      await createHall(formData);
      notifications.show({
        title: "Success",
        message: "Hall created successfully",
        color: "green",
      });
      setModalOpen(false);
      loadHalls();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to create hall",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHall = async (hall) => {
    if (!window.confirm(`Are you sure you want to delete ${hall.hall_name}?`)) {
      return;
    }
    try {
      await deleteHall(hall.id);
      notifications.show({
        title: "Success",
        message: "Hall deleted successfully",
        color: "green",
      });
      loadHalls();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to delete hall",
        color: "red",
      });
    }
  };

  const handleStatusChange = async (hall, newStatus) => {
    try {
      await updateHallStatus(hall.id, newStatus);
      notifications.show({
        title: "Success",
        message: `Hall status updated to ${newStatus}`,
        color: "green",
      });
      loadHalls();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.detail || "Failed to update status",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Hall Management</Title>
        {isSuperAdmin && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            Add Hall
          </Button>
        )}
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <HallsTable
        halls={halls}
        loading={loading}
        onDelete={isSuperAdmin ? handleDeleteHall : undefined}
        onView={(hall) => console.log("View hall:", hall)}
        onStatusChange={isSuperAdmin ? handleStatusChange : undefined}
      />

      {isSuperAdmin && (
        <CreateHallModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateHall}
          loading={submitting}
        />
      )}
    </Card>
  );
}
