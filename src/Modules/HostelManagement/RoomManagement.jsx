/**
 * RoomManagement Feature
 * Manages hostel rooms
 */

import React, { useState, useEffect, useCallback } from "react";
import { Flex, Title, Alert, Select } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import RoomsTable from "./components/RoomsTable";
import { fetchRooms, fetchHalls } from "./api";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
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

  const loadRooms = useCallback(async () => {
    if (!selectedHall) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRooms(selectedHall);
      setRooms(data);
    } catch (err) {
      setError("Failed to load rooms. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedHall]);

  useEffect(() => {
    loadHalls();
  }, [loadHalls]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return (
    <Flex direction="column" gap="md">
      <Flex justify="space-between" align="center">
        <Title order={2}>Room Management</Title>
        <Select
          placeholder="Select Hall"
          data={halls.map((h) => ({ value: String(h.id), label: h.hall_name }))}
          value={selectedHall}
          onChange={setSelectedHall}
          style={{ width: 200 }}
        />
      </Flex>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <RoomsTable rooms={rooms} loading={loading} />
    </Flex>
  );
}
