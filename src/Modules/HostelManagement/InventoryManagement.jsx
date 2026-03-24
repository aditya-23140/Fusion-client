import React, { useState, useEffect, useCallback } from "react";
import { Title, Button, Card, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import InventoryTable from "./components/InventoryTable";
import CreateInventoryModal from "./components/CreateInventoryModal";
import { fetchHalls, fetchInventory, createInventory, deleteInventory } from "./api";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const hallsData = await fetchHalls();
      setHalls(hallsData);

      if (hallsData.length > 0) {
        const hallId = selectedHall || hallsData[0].id;
        setSelectedHall(hallId);
        const inventoryData = await fetchInventory(hallId);
        setInventory(inventoryData);
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to load inventory",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedHall]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleCreateInventory = async (formData) => {
    try {
      setSubmitting(true);
      await createInventory(formData);
      notifications.show({
        title: "Success",
        message: "Item added",
        color: "green",
      });
      setModalOpen(false);
      loadInventory();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInventory = async (item) => {
    if (!window.confirm("Delete?")) return;
    try {
      await deleteInventory(item.id);
      notifications.show({
        title: "Success",
        message: "Item deleted",
        color: "green",
      });
      loadInventory();
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
        <Title order={3}>Inventory Management</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
          Add Item
        </Button>
      </Group>
      <InventoryTable inventory={inventory} loading={loading} onDelete={handleDeleteInventory} showActions />
      <CreateInventoryModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateInventory}
        loading={submitting}
        halls={halls}
      />
    </Card>
  );
}
