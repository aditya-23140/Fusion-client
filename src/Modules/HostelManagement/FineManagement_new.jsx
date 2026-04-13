/**
 * FineManagement - Thin View
 * Manages hostel fines
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
  Tabs,
  Stack,
  Badge,
  Text,
} from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import FineStatusCard from "./components/FineStatusCard";
import ImposeFineModal from "./components/ImposeFineModal";
import { fetchFines, imposeFine, markFinePaid, waiveFine } from "./api";

export default function FineManagement() {
  const [fines, setFines] = useState([]);
  const [myFines, setMyFines] = useState([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const finesData = await fetchFines();
      setFines(finesData);
      setMyFines(finesData.filter((f) => f.is_my_fine));
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

  const handleMarkPaid = async (fine) => {
    try {
      await markFinePaid(fine.id);
      notifications.show({
        title: "Success",
        message: "Fine marked as paid",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to mark as paid",
        color: "red",
      });
    }
  };

  const handleWaiveFine = async (fine) => {
    try {
      await waiveFine(fine.id);
      notifications.show({
        title: "Success",
        message: "Fine waived successfully",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to waive fine",
        color: "red",
      });
    }
  };

  const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const paidAmount = fines
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Fine Management</Title>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setModalOpen(true)}
          >
            Impose Fine
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
              <Text size="sm" fw={500} c="dimmed">
                Total Fines
              </Text>
              <Text fw={700} size="xl">
                ₹{totalAmount.toLocaleString()}
              </Text>
            </Stack>
          </Card>
          <Card withBorder p="lg">
            <Stack gap={4}>
              <Text size="sm" fw={500} c="dimmed">
                Paid Amount
              </Text>
              <Text fw={700} size="xl" c="green">
                ₹{paidAmount.toLocaleString()}
              </Text>
            </Stack>
          </Card>
          <Card withBorder p="lg">
            <Stack gap={4}>
              <Text size="sm" fw={500} c="dimmed">
                Pending Amount
              </Text>
              <Text fw={700} size="xl" c="red">
                ₹{(totalAmount - paidAmount).toLocaleString()}
              </Text>
            </Stack>
          </Card>
        </Group>

        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="my" rightSection={<Badge>{myFines.length}</Badge>}>
              My Fines
            </Tabs.Tab>
            <Tabs.Tab value="all" rightSection={<Badge>{fines.length}</Badge>}>
              All Fines
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="my" pt="xl">
            <Stack gap="md">
              {myFines.length === 0 ? (
                <Card withBorder p="xl">
                  <p>No fines</p>
                </Card>
              ) : (
                myFines.map((fine) => (
                  <FineStatusCard
                    key={fine.id}
                    fine={fine}
                    canMarkPaid={fine.status === "pending"}
                    showActions
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="all" pt="xl">
            <Stack gap="md">
              {fines.length === 0 ? (
                <Card withBorder p="xl">
                  <p>No fines found</p>
                </Card>
              ) : (
                fines.map((fine) => (
                  <FineStatusCard
                    key={fine.id}
                    fine={fine}
                    onMarkPaid={() => handleMarkPaid(fine)}
                    onWaive={() => handleWaiveFine(fine)}
                    canMarkPaid={fine.status === "pending"}
                    canWaive={fine.status === "pending"}
                    showActions
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <ImposeFineModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleImposeFine}
          loading={submitting}
        />
      </Stack>
    </Container>
  );
}
