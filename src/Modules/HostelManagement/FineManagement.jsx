/**
 * FineManagement Feature
 * Manages hostel fines
 */

import React, { useState, useEffect, useCallback } from "react";
import { Flex, Title, Button, Alert, Tabs } from "@mantine/core";
import {
  IconPlus,
  IconAlertCircle,
  IconList,
  IconUser,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import FinesTable from "./components/FinesTable";
import ImposeFineModal from "./components/ImposeFineModal";
import {
  fetchFines,
  fetchMyFines,
  imposeFine,
  updateFine,
  deleteFine,
} from "./api";

export default function FineManagement() {
  const [fines, setFines] = useState([]);
  const [myFines, setMyFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [finesData, myFinesData] = await Promise.all([
        fetchFines(),
        fetchMyFines(),
      ]);
      setFines(finesData);
      setMyFines(myFinesData);
    } catch (err) {
      setError("Failed to load fines. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleImposeFine = async (formData) => {
    try {
      setSubmitting(true);
      await imposeFine(formData);
      notifications.show({
        title: "Success",
        message: "Fine imposed successfully",
        color: "green",
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to impose fine",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFine = async (fine) => {
    try {
      await updateFine(fine.id, { status: "Paid" });
      notifications.show({
        title: "Success",
        message: "Fine marked as paid",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to update fine",
        color: "red",
      });
    }
  };

  const handleDeleteFine = async (fine) => {
    if (!window.confirm("Are you sure you want to delete this fine?")) {
      return;
    }
    try {
      await deleteFine(fine.id);
      notifications.show({
        title: "Success",
        message: "Fine deleted successfully",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to delete fine",
        color: "red",
      });
    }
  };

  return (
    <Flex direction="column" gap="md">
      <Flex justify="space-between" align="center">
        <Title order={2}>Fine Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Impose Fine
        </Button>
      </Flex>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconList size={14} />}>
            All Fines
          </Tabs.Tab>
          <Tabs.Tab value="my" leftSection={<IconUser size={14} />}>
            My Fines
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <FinesTable
            fines={fines}
            loading={loading}
            showActions
            onEdit={handleUpdateFine}
            onDelete={handleDeleteFine}
          />
        </Tabs.Panel>

        <Tabs.Panel value="my">
          <FinesTable fines={myFines} loading={loading} />
        </Tabs.Panel>
      </Tabs>

      <ImposeFineModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleImposeFine}
        loading={submitting}
      />
    </Flex>
  );
}
