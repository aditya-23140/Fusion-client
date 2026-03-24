/**
 * InventoryManagement Feature
 * Manages hostel inventory
 */

import React, { useState, useEffect, useCallback } from "react";
import { Flex, Title, Button, Alert, Select, Group } from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import InventoryTable from "./components/InventoryTable";
import CreateInventoryModal from "./components/CreateInventoryModal";
import {
  fetchInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  fetchHalls,
} from "./api";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadHalls = useCallback(async () => {
    try {
      const hallsData = await fetchHalls();
      setHalls(hallsData);
      if (hallsData.length > 0) {
        setSelectedHall(String(hallsData[0].id));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadInventory = useCallback(async () => {
    if (!selectedHall) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInventory(selectedHall);
      setInventory(data);
    } catch (err) {
      setError("Failed to load inventory. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedHall]);

  useEffect(() => {
    loadHalls();
  }, [loadHalls]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleCreateInventory = async (formData) => {
    try {
      setSubmitting(true);
      await createInventory(formData);
      notifications.show({
        title: "Success",
        message: "Inventory item added successfully",
        color: "green",
      });
      setModalOpen(false);
      loadInventory();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to add inventory item",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInventory = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    try {
      await deleteInventory(item.id);
      notifications.show({
        title: "Success",
        message: "Inventory item deleted successfully",
        color: "green",
      });
      loadInventory();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to delete inventory item",
        color: "red",
      });
    }
  };

  return (
    <Flex direction="column" gap="md">
      <Group justify="space-between" mb="md">
        <Title order={2}>Inventory Management</Title>
        <Group>
          <Select
            placeholder="Select Hall"
            data={halls.map((h) => ({
              value: String(h.id),
              label: h.hall_name,
            }))}
            value={selectedHall}
            onChange={setSelectedHall}
            style={{ width: 200 }}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            Add Item
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <InventoryTable
        inventory={inventory}
        loading={loading}
        showActions
        onEdit={(item) => console.log("Edit item:", item)}
        onDelete={handleDeleteInventory}
      />

      <CreateInventoryModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateInventory}
        loading={submitting}
        halls={halls}
      />
    </Flex>
  );
}
