import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Title,
  Text,
  Tabs,
  Alert,
  Loader,
  Transition,
  Divider,
  Grid,
  Group,
  Stack,
  Center,
  Card,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingSkyscraper,
  IconUserCog,
  IconBuilding,
  IconKey,
  IconCircleCheck,
  IconHistory,
  IconLayoutDashboard,
  IconListCheck,
  IconHome,
} from "@tabler/icons-react";

// Components
import ApplicationWindowBanner from "./ApplicationWindowBanner";
import AccommodationRequestForm from "./AccommodationRequestForm";
import AllotmentDashboard from "./AllotmentDashboard";
import BulkAllotmentPanel from "./BulkAllotmentPanel";
import CapacityHeatmap from "./CapacityHeatmap";
import AllotmentListView from "./AllotmentListView";

// API
import * as api from "../../api";

/**
 * AccommodationAllotment Component (HM-WF-103)
 *
 * Orchestrates the Student Accommodation Request and Super Admin Bulk Allotment workflow.
 * Handles state management, role-based views, and real-time dashboard updates using Mantine UI.
 */
function AccommodationAllotment({ userRole }) {
  // State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [windows, setWindows] = useState([]);
  const [requests, setRequests] = useState([]);
  const [capacityData, setCapacityData] = useState([]);
  const [myAllotment, setMyAllotment] = useState(null);
  const [selectedRequestIds, setSelectedRequestIds] = useState([]);

  const isSuperAdmin = userRole === "superadmin" || userRole === "super_admin";
  const isCaretaker = userRole === "caretaker";
  const isWarden = userRole === "warden";
  const isStaff = isWarden || isCaretaker;
  const isStudent = userRole === "student" || (!isSuperAdmin && !isStaff);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const windowData = await api.fetchAccommodationWindows();
      setWindows(windowData);

      if (isStudent) {
        try {
          const allotment = await api.fetchMyAllotment();
          setMyAllotment(allotment);
        } catch (e) {
          // No allotment found is expected for new students
        }
      }

      if (isSuperAdmin || isStaff) {
        const fetchTasks = [api.fetchRoomCapacityDashboard()];

        // Only caretaker sees pending requests now
        if (isCaretaker) {
          fetchTasks.push(
            api.fetchAccommodationRequests({ status: "Pending" }),
          );
        }

        const reports = await Promise.all(fetchTasks);
        setCapacityData(reports[0]);
        if (isCaretaker && reports[1]) {
          setRequests(reports[1].results || reports[1]);
        }
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load accommodation data",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  // Initial Data Fetch
  useEffect(() => {
    loadInitialData();
  }, [userRole]);

  // Handlers
  const handleRequestSubmit = async (data) => {
    setActionLoading(true);
    try {
      await api.submitAccommodationRequest(data);
      notifications.show({
        title: "Success",
        message: "Request submitted successfully!",
        color: "green",
      });
      loadInitialData();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.detail || "Submission failed",
        color: "red",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAllot = async () => {
    setActionLoading(true);
    try {
      const results = await api.performBulkAllotment(selectedRequestIds);
      const successCount = results.success.length;
      const failedCount = results.failed.length;
      notifications.show({
        title: "Allotment Complete",
        message: `${successCount} successful, ${failedCount} failed.`,
        color: successCount > 0 ? "green" : "red",
      });
      setSelectedRequestIds([]);
      loadInitialData();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Bulk allotment failed",
        color: "red",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectRequest = (id) => {
    setSelectedRequestIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAllRequests = () => {
    if (selectedRequestIds.length === requests.length) {
      setSelectedRequestIds([]);
    } else {
      setSelectedRequestIds(requests.map((r) => r.id));
    }
  };

  const activeWindow = windows.find((w) => w.is_active);

  if (loading) {
    return (
      <Center style={{ height: "60vh" }}>
        <Loader size={60} type="dots" />
      </Center>
    );
  }

  return (
    <Transition mounted transition="fade" duration={800}>
      {(styles) => (
        <Container size="xl" py="xl" style={styles}>
          <Box mb="xl">
            <Group justify="space-between" align="flex-end">
              <Stack gap={4}>
                <Title order={1} fw={900} style={{ letterSpacing: "-1px" }}>
                  Hall Accommodation
                </Title>
                <Text c="dimmed" size="sm">
                  {isStudent
                    ? "Request and manage your hostel allotment"
                    : "Multi-hostel capacity & student assignment management"}
                </Text>
              </Stack>
            </Group>
          </Box>

          <Divider mb="xl" />

          {isSuperAdmin && (
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              variant="pills"
              mb="xl"
            >
              <Tabs.List>
                <Tabs.Tab
                  value="dashboard"
                  leftSection={<IconLayoutDashboard size={16} />}
                >
                  Capacity Dashboard
                </Tabs.Tab>
                <Tabs.Tab
                  value="allotments"
                  leftSection={<IconUserCog size={16} />}
                >
                  Allotment List
                </Tabs.Tab>
              </Tabs.List>

              <Box mt="xl">
                <Tabs.Panel value="dashboard">
                  <CapacityHeatmap capacityData={capacityData} />
                </Tabs.Panel>

                <Tabs.Panel value="allotments">
                  <AllotmentListView isSuperAdmin={isSuperAdmin} />
                </Tabs.Panel>
              </Box>
            </Tabs>
          )}

          {isStaff && (
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              variant="pills"
              mb="xl"
            >
              <Tabs.List>
                <Tabs.Tab
                  value="dashboard"
                  leftSection={<IconLayoutDashboard size={16} />}
                >
                  Capacity Dashboard
                </Tabs.Tab>
                {isCaretaker && (
                  <Tabs.Tab
                    value="requests"
                    leftSection={<IconListCheck size={16} />}
                  >
                    Pending Requests
                  </Tabs.Tab>
                )}
                <Tabs.Tab
                  value="allotments"
                  leftSection={<IconUserCog size={16} />}
                >
                  Allotment List
                </Tabs.Tab>
              </Tabs.List>

              <Box mt="xl">
                <Tabs.Panel value="dashboard">
                  <CapacityHeatmap capacityData={capacityData} />
                </Tabs.Panel>

                {isCaretaker && (
                  <Tabs.Panel value="requests">
                    <Box>
                      <ApplicationWindowBanner
                        window={activeWindow}
                        isStudent={false}
                      />
                      <AllotmentDashboard
                        requests={requests}
                        selectedIds={selectedRequestIds}
                        onSelect={handleSelectRequest}
                        onSelectAll={handleSelectAllRequests}
                      />
                      <BulkAllotmentPanel
                        selectedCount={selectedRequestIds.length}
                        onBulkAllot={handleBulkAllot}
                        onClear={() => setSelectedRequestIds([])}
                        loading={actionLoading}
                      />
                    </Box>
                  </Tabs.Panel>
                )}

                <Tabs.Panel value="allotments">
                  <AllotmentListView isSuperAdmin={false} />
                </Tabs.Panel>
              </Box>
            </Tabs>
          )}

          {isStudent && (
            <Box>
              {myAllotment ? (
                <Card
                  withBorder
                  shadow="sm"
                  radius="md"
                  p={0}
                  style={{
                    overflow: "hidden",
                    border: "1px solid var(--mantine-color-green-light-hover)",
                  }}
                >
                  <Box
                    p="md"
                    bg="var(--mantine-color-green-light)"
                    style={{
                      borderBottom:
                        "1px solid var(--mantine-color-green-light-hover)",
                      background:
                        "linear-gradient(45deg, var(--mantine-color-green-light) 0%, #f6ffed 100%)",
                    }}
                  >
                    <Group justify="space-between">
                      <Group gap="sm">
                        <ThemeIcon
                          color="green"
                          variant="light"
                          size="lg"
                          radius="md"
                        >
                          <IconBuilding size={20} />
                        </ThemeIcon>
                        <Stack gap={0}>
                          <Title order={3} fw={800} c="green.9">
                            Your Hostel Allotment
                          </Title>
                          <Text size="xs" c="green.7" fw={500}>
                            Active Residence Assignment
                          </Text>
                        </Stack>
                      </Group>
                      <Group gap="xs">
                        {myAllotment.is_legacy && (
                          <Badge
                            variant="dot"
                            color="orange"
                            size="md"
                            leftSection={<IconHistory size={12} />}
                          >
                            Legacy Record
                          </Badge>
                        )}
                        <Badge
                          variant="filled"
                          color="green"
                          size="lg"
                          radius="sm"
                          leftSection={<IconCircleCheck size={14} />}
                        >
                          ACTIVE
                        </Badge>
                      </Group>
                    </Group>
                  </Box>

                  <Box p="xl">
                    <Grid gutter={40}>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group align="flex-start" wrap="nowrap">
                          <ThemeIcon
                            variant="transparent"
                            color="dimmed"
                            size="sm"
                          >
                            <IconBuildingSkyscraper size={18} />
                          </ThemeIcon>
                          <Stack gap={0}>
                            <Text
                              size="xs"
                              c="dimmed"
                              fw={700}
                              tt="uppercase"
                              style={{ letterSpacing: "1px" }}
                            >
                              Assigned Hostel
                            </Text>
                            <Text
                              size="xl"
                              fw={900}
                              variant="gradient"
                              gradient={{ from: "green.9", to: "green.7" }}
                            >
                              {myAllotment.hostel_name}
                            </Text>
                          </Stack>
                        </Group>
                      </Grid.Col>

                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Group align="flex-start" wrap="nowrap">
                          <ThemeIcon
                            variant="transparent"
                            color="dimmed"
                            size="sm"
                          >
                            <IconKey size={18} />
                          </ThemeIcon>
                          <Stack gap={0}>
                            <Text
                              size="xs"
                              c="dimmed"
                              fw={700}
                              tt="uppercase"
                              style={{ letterSpacing: "1px" }}
                            >
                              Room Selection
                            </Text>
                            <Text size="xl" fw={900} c="dark.4">
                              {myAllotment.room_number}
                            </Text>
                          </Stack>
                        </Group>
                      </Grid.Col>
                    </Grid>

                    {myAllotment.allotted_at && (
                      <Box
                        mt="xl"
                        pt="md"
                        style={{
                          borderTop: "1px dashed var(--mantine-color-gray-3)",
                        }}
                      >
                        <Text size="xs" c="dimmed">
                          Occupied since{" "}
                          {new Date(myAllotment.allotted_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Card>
              ) : (
                <>
                  <ApplicationWindowBanner
                    window={activeWindow}
                    isStudent
                    onApply={() =>
                      notifications.show({
                        message: "Scroll down to submit preferences",
                        color: "blue",
                      })
                    }
                  />
                  {!activeWindow && (
                    <Alert
                      icon={<IconHome size={16} />}
                      title="Notice"
                      color="blue"
                      radius="md"
                    >
                      There are no active application windows at this time.
                    </Alert>
                  )}
                  {activeWindow && (
                    <AccommodationRequestForm
                      window={activeWindow}
                      onSubmit={handleRequestSubmit}
                      loading={actionLoading}
                    />
                  )}
                </>
              )}
            </Box>
          )}
        </Container>
      )}
    </Transition>
  );
}

AccommodationAllotment.propTypes = {
  userRole: PropTypes.string.isRequired,
};

export default AccommodationAllotment;
