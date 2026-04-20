/**
 * AttendanceManagement Feature
 * Manages student attendance
 */

import React, { useState, useEffect, useCallback } from "react";
import { Card, Title, Group, Alert, Select, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import AttendanceTable from "./components/AttendanceTable";
import { fetchAttendance, fetchHalls } from "./api";

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const loadAttendance = useCallback(async () => {
    if (!selectedHall) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAttendance(selectedHall);
      setAttendance(data);
    } catch (err) {
      setError("Failed to load attendance. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedHall]);

  useEffect(() => {
    loadHalls();
  }, [loadHalls]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Attendance Records</Title>
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
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <AttendanceTable attendance={attendance} loading={loading} />
      </Card>
    </Stack>
  );
}
