import React, { useState, useEffect, useCallback } from "react";
import { Title, Button, Card, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import HallsTable from "./components/HallsTable";
import CreateHallModal from "./components/CreateHallModal";
import { fetchHalls, createHall, deleteHall } from "./api";

export default function HallManagement() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadHalls = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchHalls();
      setHalls(data);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to load halls",
        color: "red",
      });
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
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteHall(hall.id);
      notifications.show({
        title: "Success",
        message: "Hall deleted",
        color: "green",
      });
      loadHalls();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to delete",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Hall Management</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
          Add Hall
        </Button>
      </Group>
      <HallsTable halls={halls} loading={loading} onDelete={handleDeleteHall} />
      <CreateHallModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateHall}
        loading={submitting}
      />
    </Card>
  );
}
