import React, { useState, useEffect, useCallback } from "react";
import { Title, Card } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import AttendanceTable from "./components/AttendanceTable";
import { fetchAttendance, fetchHalls } from "./api";

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState(null);

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const hallsData = await fetchHalls();
      setHalls(hallsData);

      if (hallsData.length > 0) {
        const hallId = selectedHall || hallsData[0].id;
        setSelectedHall(hallId);
        const attendanceData = await fetchAttendance(hallId);
        setAttendance(attendanceData);
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to load attendance",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedHall]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">
        Attendance Management
      </Title>
      <AttendanceTable attendance={attendance} loading={loading} />
    </Card>
  );
}
