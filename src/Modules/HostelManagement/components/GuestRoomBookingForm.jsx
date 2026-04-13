/**
 * GuestRoomBookingForm - Micro Component
 * Form for submitting guest room booking requests
 * Dumb component - receives data and callbacks from parent
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Group,
  TextInput,
  Textarea,
  Stack,
  Text,
  Alert,
  NumberInput,
  Select,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconClock } from "@tabler/icons-react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export default function GuestRoomBookingForm({
  opened,
  onClose,
  onSubmit,
  loading = false,
}) {
  const form = useForm({
    initialValues: {
      guest_name: "",
      guest_email: "",
      guest_phone: "",
      guest_address: "",
      nationality: "",
      arrival_date: null,
      arrival_time: null,
      departure_date: null,
      departure_time: null,
      purpose: "",
      total_guests: 1,
      rooms_required: 1,
      room_type: "single",
    },
    validate: {
      guest_name: (value) =>
        value && value.length >= 3
          ? null
          : "Name must be at least 3 characters",
      guest_email: (value) => {
        if (!value) return "Email is required";
        return /^\S+@\S+$/.test(value) ? null : "Invalid email address";
      },
      guest_phone: (value) =>
        value && value.length >= 10
          ? null
          : "Phone must be at least 10 characters",
      guest_address: (value) =>
        value && value.length >= 5
          ? null
          : "Address must be at least 5 characters",
      arrival_date: (value) => (value ? null : "Arrival date is required"),
      arrival_time: (value) => (value ? null : "Arrival time is required"),
      departure_date: (value, values) => {
        if (!value) return "Departure date is required";
        if (value <= values.arrival_date)
          return "Departure must be after arrival";
        return null;
      },
      departure_time: (value) => (value ? null : "Departure time is required"),
      purpose: (value) =>
        value && value.length >= 10
          ? null
          : "Purpose must be at least 10 characters",
      total_guests: (value) => {
        if (!value || value <= 0) return "Total guests must be greater than 0";
        if (value > 100) return "Total guests cannot exceed 100";
        return null;
      },
      rooms_required: (value) => {
        if (!value || value <= 0)
          return "Rooms required must be greater than 0";
        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const minDepartureDate = form.values.arrival_date
    ? new Date(form.values.arrival_date)
    : new Date();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Book Guest Room"
      size="lg"
      centered
      scrollAreaComponent={Modal.ScrollArea}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Alert
            icon={<IconAlertCircle />}
            color="blue"
            title="Guest Information"
          >
            <Text size="sm">
              Please provide complete details of your guest and booking
              preferences
            </Text>
          </Alert>

          {/* Guest Basic Information */}
          <div>
            <Text fw={600} size="sm" mb="sm">
              Guest Details
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="Guest Name"
                placeholder="Full name of guest"
                value={form.values.guest_name}
                onChange={(e) =>
                  form.setFieldValue("guest_name", e.currentTarget.value)
                }
                error={form.errors.guest_name}
              />
              <TextInput
                label="Email"
                placeholder="guest@example.com"
                type="email"
                value={form.values.guest_email}
                onChange={(e) =>
                  form.setFieldValue("guest_email", e.currentTarget.value)
                }
                error={form.errors.guest_email}
              />
              <TextInput
                label="Phone"
                placeholder="+91 XXXXXXXXXX"
                value={form.values.guest_phone}
                onChange={(e) =>
                  form.setFieldValue("guest_phone", e.currentTarget.value)
                }
                error={form.errors.guest_phone}
              />
              <TextInput
                label="Nationality"
                placeholder="e.g., Indian"
                value={form.values.nationality}
                onChange={(e) =>
                  form.setFieldValue("nationality", e.currentTarget.value)
                }
              />
            </SimpleGrid>
          </div>

          <TextInput
            label="Guest Address"
            placeholder="Full address of the guest"
            value={form.values.guest_address}
            onChange={(e) =>
              form.setFieldValue("guest_address", e.currentTarget.value)
            }
            error={form.errors.guest_address}
          />

          <Divider />

          {/* Booking Dates & Times */}
          <div>
            <Text fw={600} size="sm" mb="sm">
              Booking Duration
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <div>
                <DatePickerInput
                  label="Arrival Date"
                  placeholder="Select date"
                  minDate={new Date()}
                  value={form.values.arrival_date}
                  onChange={(value) =>
                    form.setFieldValue("arrival_date", value)
                  }
                  styles={{
                    month: { tableLayout: "auto" },
                  }}
                  error={form.errors.arrival_date}
                  withAsterisk
                />
              </div>

              <div>
                <TimeInput
                  label="Arrival Time"
                  placeholder="Select time"
                  value={form.values.arrival_time || ""}
                  onChange={(event) =>
                    form.setFieldValue(
                      "arrival_time",
                      event.currentTarget.value,
                    )
                  }
                  leftSection={<IconClock size={16} />}
                  error={form.errors.arrival_time}
                  withAsterisk
                />
              </div>

              <div>
                <DatePickerInput
                  label="Departure Date"
                  placeholder="Select date"
                  minDate={minDepartureDate}
                  value={form.values.departure_date}
                  onChange={(value) =>
                    form.setFieldValue("departure_date", value)
                  }
                  styles={{
                    month: { tableLayout: "auto" },
                  }}
                  error={form.errors.departure_date}
                  withAsterisk
                />
              </div>

              <div>
                <TimeInput
                  label="Departure Time"
                  placeholder="Select time"
                  value={form.values.departure_time || ""}
                  onChange={(event) =>
                    form.setFieldValue(
                      "departure_time",
                      event.currentTarget.value,
                    )
                  }
                  leftSection={<IconClock size={16} />}
                  error={form.errors.departure_time}
                  withAsterisk
                />
              </div>
            </SimpleGrid>
          </div>

          <Divider />

          {/* Booking Details */}
          <div>
            <Text fw={600} size="sm" mb="sm">
              Room & Guest Details
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <NumberInput
                label="Total Guests"
                placeholder="Number of guests"
                min={1}
                max={100}
                value={form.values.total_guests}
                onChange={(value) => form.setFieldValue("total_guests", value)}
                error={form.errors.total_guests}
              />
              <NumberInput
                label="Rooms Required"
                placeholder="Number of rooms needed"
                min={1}
                value={form.values.rooms_required}
                onChange={(value) =>
                  form.setFieldValue("rooms_required", value)
                }
                error={form.errors.rooms_required}
              />

              <Select
                label="Room Type"
                placeholder="Select room type"
                value={form.values.room_type}
                onChange={(value) => form.setFieldValue("room_type", value)}
                data={[
                  { value: "single", label: "Single" },
                  { value: "double", label: "Double" },
                  { value: "triple", label: "Triple" },
                ]}
              />
            </SimpleGrid>
          </div>

          <Divider />

          {/* Purpose */}
          <div>
            <Text fw={600} size="sm" mb="sm">
              Purpose of Visit
            </Text>
            <Textarea
              placeholder="Why is the guest visiting? (minimum 10 characters)"
              minRows={3}
              value={form.values.purpose}
              onChange={(e) =>
                form.setFieldValue("purpose", e.currentTarget.value)
              }
              error={form.errors.purpose}
            />
          </div>

          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Book Room
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

GuestRoomBookingForm.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
