import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Text,
  Title,
  Grid,
  Badge,
  Progress,
  Tooltip,
  Group,
  Stack,
  ThemeIcon,
  RingProgress,
  Center,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import {
  IconDoor,
  IconUsers,
  IconBuildingCommunity,
  IconArrowUpRight,
  IconCircleCheckFilled,
  IconMan,
  IconWoman,
  IconUsersGroup,
} from "@tabler/icons-react";

/**
 * CapacityHeatmap Component
 *
 * Visualization of hostel occupancy status using Mantine UI.
 * uses color-coded metrics to show availability across halls with premium dashboard cards.
 */
function CapacityHeatmap({ capacityData }) {
  // Compute overall statistics
  const totalCapacity = capacityData.reduce(
    (acc, h) => acc + h.total_capacity,
    0,
  );
  const totalOccupied = capacityData.reduce(
    (acc, h) => acc + h.occupied_seats,
    0,
  );
  const totalVacancy = totalCapacity - totalOccupied;
  const overallOccupancyRate =
    totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

  if (capacityData.length === 0) {
    return (
      <Paper p="xl" radius="md" withBorder ta="center" py={100} bg="gray.0">
        <IconBuildingCommunity
          size={50}
          color="gray"
          style={{ opacity: 0.5 }}
        />
        <Title order={3} mt="md" c="dimmed">
          No Capacity Data Available
        </Title>
        <Text c="dimmed">Hostel records will appear here once configured.</Text>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header Summary Stats */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb={40}>
        <Paper p="lg" radius="md" withBorder shadow="sm" bg="white">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text c="dimmed" size="xs" fw={700} tt="uppercase">
                Total Capacity
              </Text>
              <Title order={2} fw={900}>
                {totalCapacity}
              </Title>
              <Text size="xs" c="dimmed" mt={4}>
                Seats across all halls
              </Text>
            </Stack>
            <ThemeIcon color="blue" size={50} radius="md" variant="light">
              <IconBuildingCommunity size={30} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper p="lg" radius="md" withBorder shadow="sm" bg="white">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text c="dimmed" size="xs" fw={700} tt="uppercase">
                Current Occupancy
              </Text>
              <Title order={2} fw={900}>
                {totalOccupied}
              </Title>
              <Group gap={4} mt={4}>
                <Text
                  size="xs"
                  c={overallOccupancyRate > 90 ? "red" : "blue"}
                  fw={700}
                >
                  {Math.round(overallOccupancyRate)}% Full
                </Text>
              </Group>
            </Stack>
            <RingProgress
              size={60}
              thickness={6}
              sections={[
                {
                  value: overallOccupancyRate,
                  color: overallOccupancyRate > 90 ? "red" : "blue",
                },
              ]}
              label={
                <Center>
                  <IconUsers size={20} />
                </Center>
              }
            />
          </Group>
        </Paper>

        <Paper p="lg" radius="md" withBorder shadow="sm" bg="white">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text c="dimmed" size="xs" fw={700} tt="uppercase">
                Available Vacancies
              </Text>
              <Title order={2} fw={900} c="green.8">
                {totalVacancy}
              </Title>
              <Text size="xs" c="dimmed" mt={4}>
                Open for allotment
              </Text>
            </Stack>
            <ThemeIcon color="green" size={50} radius="md" variant="light">
              <IconCircleCheckFilled size={30} />
            </ThemeIcon>
          </Group>
        </Paper>
      </SimpleGrid>

      <Divider
        label={
          <Title order={4} fw={800} c="gray.7">
            Hostel Wise Capacity
          </Title>
        }
        labelPosition="left"
        mb="xl"
      />

      <Grid gutter="xl">
        {capacityData.map((hostel) => {
          const occupancyRate =
            (hostel.occupied_seats / hostel.total_capacity) * 100;
          let statusColor = "blue";
          if (occupancyRate > 90) {
            statusColor = "red";
          } else if (occupancyRate > 75) {
            statusColor = "orange";
          } else {
            statusColor = "green";
          }

          const isFemale = hostel.type?.toLowerCase().includes("girl");
          const isMale = hostel.type?.toLowerCase().includes("boy");

          return (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={hostel.id}>
              <Paper
                p="xl"
                radius="lg"
                withBorder
                shadow="sm"
                style={{
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
                  cursor: "default",
                  overflow: "hidden",
                }}
                styles={{
                  root: {
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                      borderColor: "#228be6",
                    },
                  },
                }}
              >
                {/* Visual Accent */}
                <Box
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "4px",
                    height: "100%",
                    backgroundColor: `var(--mantine-color-${statusColor}-6)`,
                  }}
                />

                <Group justify="space-between" align="flex-start" mb="xl">
                  <Stack gap={4}>
                    <Group gap="xs">
                      <ThemeIcon
                        variant="light"
                        color={isFemale ? "pink" : isMale ? "blue" : "cyan"}
                        size="md"
                        radius="sm"
                      >
                        {isFemale ? (
                          <IconWoman size={16} />
                        ) : isMale ? (
                          <IconMan size={16} />
                        ) : (
                          <IconUsersGroup size={16} />
                        )}
                      </ThemeIcon>
                      <Text
                        size="xs"
                        c="dimmed"
                        fw={800}
                        tt="uppercase"
                        ls={0.5}
                      >
                        {hostel.type}s Hostel
                      </Text>
                    </Group>
                    <Title order={4} fw={900} lts={-0.5}>
                      {hostel.name}
                    </Title>
                  </Stack>
                  <Badge
                    variant="filled"
                    color={statusColor}
                    size="md"
                    radius="md"
                    fw={900}
                    h={28}
                  >
                    {Math.round(occupancyRate)}%
                  </Badge>
                </Group>

                <Box mb="xl">
                  <Group justify="space-between" mb={8}>
                    <Text size="sm" fw={600}>
                      Occupancy Status
                    </Text>
                    <Text
                      size="sm"
                      fw={800}
                      c={statusColor === "green" ? "green.8" : statusColor}
                    >
                      {hostel.occupied_seats} / {hostel.total_capacity}
                    </Text>
                  </Group>
                  <Progress
                    value={occupancyRate}
                    color={statusColor}
                    size="xl"
                    radius="xl"
                    animated={occupancyRate > 90}
                    styles={{
                      section: {
                        transition: "width 1000ms ease",
                      },
                    }}
                  />
                </Box>

                <Group justify="space-between" align="center" mt="md">
                  <Group gap="xl">
                    <Tooltip label="Configured Rooms" withArrow>
                      <Stack gap={0}>
                        <Text size="xs" c="dimmed" fw={700}>
                          ROOMS
                        </Text>
                        <Group gap={4}>
                          <IconDoor size={16} color="gray" />
                          <Text size="sm" fw={800}>
                            {hostel.total_rooms || 0}
                          </Text>
                        </Group>
                      </Stack>
                    </Tooltip>

                    <Tooltip label="Available Seats" withArrow>
                      <Stack gap={0}>
                        <Text size="xs" c="dimmed" fw={700}>
                          AVAILABLE
                        </Text>
                        <Text size="sm" fw={800} c="green.7">
                          {hostel.total_capacity - hostel.occupied_seats}
                        </Text>
                      </Stack>
                    </Tooltip>
                  </Group>

                  <ThemeIcon variant="transparent" color="gray" size="sm">
                    <IconArrowUpRight size={18} />
                  </ThemeIcon>
                </Group>
              </Paper>
            </Grid.Col>
          );
        })}
      </Grid>
    </Box>
  );
}

CapacityHeatmap.propTypes = {
  capacityData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      total_capacity: PropTypes.number.isRequired,
      occupied_seats: PropTypes.number.isRequired,
      total_rooms: PropTypes.number,
    }),
  ).isRequired,
};

export default CapacityHeatmap;
