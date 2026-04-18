/**
 * FineManagement - Thin View (UC-016, UC-017, UC-018)
 * Manages hostel fines
 * Orchestrates components and handles state, calls api.js
 * Role-based visibility:
 * - Student: View own fines (My Fines)
 * - Caretaker: Impose fines, mark paid, waive
 * - Warden: Monitor fines, analyze
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
  Select,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconPlus,
  IconAlertCircle,
  IconUser,
  IconList,
  IconDownload,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import FineStatusCard from "./components/FineStatusCard";
import ImposeFineModal from "./components/ImposeFineModal";
import { fetchFines, imposeFine, markFinePaid, waiveFine } from "./api";

export default function FineManagement() {
  const [fines, setFines] = useState([]);
  const [myFines, setMyFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  const userRole = useSelector((state) => state.user.role);
  const isStaff = userRole === "caretaker" || userRole === "warden";
  const isStudent = userRole === "student";

  const [activeTab, setActiveTab] = useState(isStudent ? "my" : "all");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const finesData = await fetchFines();

      if (isStudent) {
        setMyFines(
          finesData.filter(
            (f) => f.is_my_fine || f.student_id === "me" || f.is_mine,
          ),
        ); // Adjust based on actual API
      } else {
        setFines(finesData);
        setMyFines(finesData.filter((f) => f.is_my_fine || f.is_mine));
      }
    } catch (err) {
      setError("Failed to load fines. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isStudent]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleImposeFine = async (formData) => {
    try {
      setSubmitting(true);
      await imposeFine(formData);
      notifications.show({
        title: "Success",
        message: "Fine imposed successfully. Student notified.",
        color: "green",
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to impose fine",
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
        message: err.response?.data?.detail || "Failed to mark as paid",
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
        message: err.response?.data?.detail || "Failed to waive fine",
        color: "red",
      });
    }
  };

  // Safe checks for amount and status
  const totalAmount = fines.reduce(
    (sum, fine) => sum + (Number(fine.amount) || 0),
    0,
  );
  const paidAmount = fines
    .filter((f) => f.status?.toLowerCase() === "paid")
    .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
  const pendingAmount = totalAmount - paidAmount;

  // Filter fines
  const filterFinesList = (list) => {
    let result = list;
    if (statusFilter) {
      result = result.filter((f) => f.status?.toLowerCase() === statusFilter);
    }
    if (categoryFilter) {
      result = result.filter((f) => f.violation_category === categoryFilter);
    }
    return result;
  };

  const filteredFines = filterFinesList(fines);
  const filteredMyFines = filterFinesList(myFines);

  const handleGenerateReport = () => {
    if (filteredFines.length === 0) {
      notifications.show({
        title: "No Data",
        message: "There are no fine records to export.",
        color: "yellow",
      });
      return;
    }

    const headers = [
      "ID",
      "Student",
      "Amount",
      "Fine Type",
      "Category",
      "Status",
      "Reason",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredFines.map((f) =>
        [
          f.id,
          `"${f.student_id || f.student?.id || ""}"`,
          f.amount,
          `"${f.fine_type || ""}"`,
          `"${f.violation_category || ""}"`,
          f.status,
          `"${(f.reason || "").replace(/"/g, '""')}"`,
          f.date || f.created_at || "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `fine_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Fine Management</Title>
          {isStaff && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setModalOpen(true)}
            >
              Impose Fine
            </Button>
          )}
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {loading ? (
          <Center py={50}>
            <Loader size="xl" type="dots" />
          </Center>
        ) : (
          <>
            {/* Stats cards for staff */}
            {isStaff && (
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
                      ₹{pendingAmount.toLocaleString()}
                    </Text>
                  </Stack>
                </Card>
              </Group>
            )}

            {/* Filters and Report */}
            <Group justify="space-between">
              <Group>
                <Select
                  placeholder="Filter by Status"
                  clearable
                  data={[
                    { value: "pending", label: "Pending" },
                    { value: "paid", label: "Paid" },
                    { value: "waived", label: "Waived" },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 200 }}
                />
                {isStaff && (
                  <Select
                    placeholder="Filter by Category"
                    clearable
                    data={[
                      { value: "hostel_rule", label: "Hostel Rule" },
                      { value: "property_damage", label: "Property Damage" },
                      { value: "attendance", label: "Attendance" },
                      { value: "room_standards", label: "Room Standards" },
                    ]}
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    style={{ width: 200 }}
                  />
                )}
              </Group>
              {isStaff && (
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<IconDownload size={16} />}
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </Button>
              )}
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                {isStudent && (
                  <Tabs.Tab
                    value="my"
                    leftSection={<IconUser size={14} />}
                    rightSection={
                      <Badge size="sm">{filteredMyFines.length}</Badge>
                    }
                  >
                    My Fines
                  </Tabs.Tab>
                )}
                {isStaff && (
                  <Tabs.Tab
                    value="all"
                    leftSection={<IconList size={14} />}
                    rightSection={
                      <Badge size="sm">{filteredFines.length}</Badge>
                    }
                  >
                    All Fines
                  </Tabs.Tab>
                )}
              </Tabs.List>

              {isStudent && (
                <Tabs.Panel value="my" pt="md">
                  <Stack gap="md">
                    {filteredMyFines.length === 0 ? (
                      <Card withBorder p="xl">
                        <Text c="dimmed" ta="center">
                          You have no fines.
                        </Text>
                      </Card>
                    ) : (
                      filteredMyFines.map((fine) => (
                        <FineStatusCard
                          key={fine.id}
                          fine={fine}
                          showActions={false}
                        />
                      ))
                    )}
                  </Stack>
                </Tabs.Panel>
              )}

              {isStaff && (
                <Tabs.Panel value="all" pt="xl">
                  <Stack gap="md">
                    {filteredFines.length === 0 ? (
                      <Card withBorder p="xl">
                        <Text c="dimmed" ta="center">
                          No fines found.
                        </Text>
                      </Card>
                    ) : (
                      filteredFines.map((fine) => (
                        <FineStatusCard
                          key={fine.id}
                          fine={fine}
                          onMarkPaid={() => handleMarkPaid(fine)}
                          onWaive={() => handleWaiveFine(fine)}
                          canMarkPaid={
                            userRole === "caretaker" &&
                            fine.status?.toLowerCase() === "pending"
                          }
                          canWaive={
                            isStaff && fine.status?.toLowerCase() === "pending"
                          }
                          showActions
                        />
                      ))
                    )}
                  </Stack>
                </Tabs.Panel>
              )}
            </Tabs>
          </>
        )}

        {userRole === "caretaker" && (
          <ImposeFineModal
            opened={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleImposeFine}
            loading={submitting}
          />
        )}
      </Stack>
    </Container>
  );
}
