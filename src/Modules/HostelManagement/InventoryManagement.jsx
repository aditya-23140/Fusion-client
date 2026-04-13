/**
 * InventoryManagement - Thin View
 * Manages hostel inventory
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
  NumberInput,
  Select,
  Textarea,
} from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import InventoryList from "./components/InventoryList";
import {
  fetchInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "./api";

export default function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      category: "",
      current_quantity: 0,
      minimum_quantity: 0,
      maximum_quantity: 0,
      description: "",
    },
    validate: {
      name: (value) => (value ? null : "Item name is required"),
      category: (value) => (value ? null : "Category is required"),
      current_quantity: (value) =>
        value >= 0 ? null : "Current quantity must be non-negative",
      minimum_quantity: (value) =>
        value >= 0 ? null : "Minimum quantity must be non-negative",
    },
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const inventoryData = await fetchInventory();
      setItems(inventoryData);
    } catch (err) {
      setError("Failed to load inventory. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddItem = async (values) => {
    try {
      setSubmitting(true);
      await createInventory(values);
      notifications.show({
        title: "Success",
        message: "Item added successfully",
        color: "green",
      });
      form.reset();
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to add item",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateItem = async (values) => {
    try {
      setSubmitting(true);
      await updateInventory(editingItem.id, values);
      notifications.show({
        title: "Success",
        message: "Item updated successfully",
        color: "green",
      });
      form.reset();
      setModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to update item",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteInventory(item.id);
        notifications.show({
          title: "Success",
          message: "Item deleted successfully",
          color: "green",
        });
        loadData();
      } catch (err) {
        notifications.show({
          title: "Error",
          message: err.response?.data?.error || "Failed to delete item",
          color: "red",
        });
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setValues({
      name: item.name,
      category: item.category,
      current_quantity: item.current_quantity,
      minimum_quantity: item.minimum_quantity,
      maximum_quantity: item.maximum_quantity || 0,
      description: item.description || "",
    });
    setModalOpen(true);
  };

  const lowStockCount = items.filter(
    (item) => item.current_quantity <= item.minimum_quantity,
  ).length;
  const outOfStockCount = items.filter(
    (item) => item.current_quantity === 0,
  ).length;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Inventory Management</Title>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => {
              setEditingItem(null);
              form.reset();
              setModalOpen(true);
            }}
          >
            Add Item
          </Button>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {error}
          </Alert>
        )}

        <Group grow>
          <Card withBorder p="lg">
            <Stack gap={4}>
              <span>Total Items</span>
              <Badge size="lg">{items.length}</Badge>
            </Stack>
          </Card>
          <Card withBorder p="lg">
            <Stack gap={4}>
              <span>Low Stock</span>
              <Badge size="lg" color="orange">
                {lowStockCount}
              </Badge>
            </Stack>
          </Card>
          <Card withBorder p="lg">
            <Stack gap={4}>
              <span>Out of Stock</span>
              <Badge size="lg" color="red">
                {outOfStockCount}
              </Badge>
            </Stack>
          </Card>
        </Group>

        <InventoryList
          items={items}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteItem}
          showActions
        />

        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? "Edit Item" : "Add New Item"}
          centered
        >
          {" "}
          <form
            onSubmit={form.onSubmit((values) =>
              editingItem ? handleUpdateItem(values) : handleAddItem(values),
            )}
          >
            <Stack gap="md">
              <TextInput
                label="Item Name"
                placeholder="Name of the inventory item"
                value={form.values.name}
                onChange={(e) =>
                  form.setFieldValue("name", e.currentTarget.value)
                }
                error={form.errors.name}
              />

              <Select
                label="Category"
                placeholder="Select category"
                data={[
                  "Maintenance",
                  "Cleaning",
                  "Bedding",
                  "Equipment",
                  "Other",
                ]}
                value={form.values.category}
                onChange={(value) => form.setFieldValue("category", value)}
                error={form.errors.category}
              />

              <NumberInput
                label="Current Quantity"
                placeholder="Current stock level"
                min={0}
                value={form.values.current_quantity}
                onChange={(value) =>
                  form.setFieldValue("current_quantity", value)
                }
                error={form.errors.current_quantity}
              />

              <NumberInput
                label="Minimum Quantity"
                placeholder="Reorder threshold"
                min={0}
                value={form.values.minimum_quantity}
                onChange={(value) =>
                  form.setFieldValue("minimum_quantity", value)
                }
                error={form.errors.minimum_quantity}
              />

              <NumberInput
                label="Maximum Quantity"
                placeholder="Maximum stock level"
                min={0}
                value={form.values.maximum_quantity}
                onChange={(value) =>
                  form.setFieldValue("maximum_quantity", value)
                }
                error={form.errors.maximum_quantity}
              />

              <Textarea
                label="Description"
                placeholder="Additional details"
                value={form.values.description}
                onChange={(e) =>
                  form.setFieldValue("description", e.currentTarget.value)
                }
                error={form.errors.description}
              />

              <Group justify="flex-end">
                <Button variant="default" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  {editingItem ? "Update" : "Add"} Item
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Container>
  );
}
