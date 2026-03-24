import React, { useState, useEffect, useCallback } from "react";
import { Title, Card } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import RoomsTable from "./components/RoomsTable";
import { fetchRooms, fetchHalls } from "./api";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState(null);

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      const hallsData = await fetchHalls();
      setHalls(hallsData);

      if (hallsData.length > 0) {
        const hallId = selectedHall || hallsData[0].id;
        setSelectedHall(hallId);
        const roomsData = await fetchRooms(hallId);
        setRooms(roomsData);
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to load rooms",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedHall]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">
        Room Management
      </Title>
      <RoomsTable rooms={rooms} loading={loading} />
    </Card>
  );
}
