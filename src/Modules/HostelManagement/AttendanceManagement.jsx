/**
 * AttendanceManagement Feature
 * Manages student attendance
 */

import React, { useState, useEffect, useCallback } from "react";
import { Flex, Title, Alert, Select } from "@mantine/core";
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
    <Flex direction="column" gap="md">
      <Flex justify="space-between" align="center">
        <Title order={2}>Attendance Records</Title>
        <Select
          placeholder="Select Hall"
          data={halls.map((h) => ({ value: String(h.id), label: h.hall_name }))}
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
    </Flex>
  );
}
