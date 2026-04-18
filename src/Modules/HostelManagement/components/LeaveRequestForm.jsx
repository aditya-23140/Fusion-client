/**
 * LeaveRequestForm - Micro Component
 * Form for submitting hostel leave requests
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
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export default function LeaveRequestForm({
  opened,
  onClose,
  onSubmit,
  loading,
}) {
  const form = useForm({
    initialValues: {
      start_date: null,
      end_date: null,
      reason: "",
      destination: "",
      contact_phone: "",
    },
    validate: {
      start_date: (value) => (value ? null : "Start date is required"),
      end_date: (value, values) => {
        if (!value) return "End date is required";
        if (value < values.start_date)
          return "End date must be after start date";
        return null;
      },
      reason: (value) =>
        value && value.length >= 10
          ? null
          : "Reason must be at least 10 characters",
    },
  });

  const handleSubmit = async (values) => {
    try {
      // Format dates for backend (YYYY-MM-DD)
      const formattedValues = {
        ...values,
        start_date:
          values.start_date instanceof Date
            ? values.start_date.toISOString().split("T")[0]
            : values.start_date,
        end_date:
          values.end_date instanceof Date
            ? values.end_date.toISOString().split("T")[0]
            : values.end_date,
      };
      await onSubmit(formattedValues);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Submit Leave Request"
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <DatePickerInput
              label="Start Date"
              placeholder="Select start date"
              minDate={new Date()}
              value={form.values.start_date}
              onChange={(value) => form.setFieldValue("start_date", value)}
              error={form.errors.start_date}
              withAsterisk
            />
            <DatePickerInput
              label="End Date"
              placeholder="Select end date"
              minDate={form.values.start_date || new Date()}
              value={form.values.end_date}
              onChange={(value) => form.setFieldValue("end_date", value)}
              error={form.errors.end_date}
              withAsterisk
            />
          </SimpleGrid>
          <Textarea
            label="Reason for Leave"
            placeholder="Provide details about your leave request"
            minRows={3}
            value={form.values.reason}
            onChange={(e) =>
              form.setFieldValue("reason", e.currentTarget.value)
            }
            error={form.errors.reason}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Destination"
              placeholder="Where will you be?"
              value={form.values.destination}
              onChange={(e) =>
                form.setFieldValue("destination", e.currentTarget.value)
              }
              error={form.errors.destination}
            />
            <TextInput
              label="Contact Phone"
              placeholder="+91 XXXXXXXXXX"
              value={form.values.contact_phone}
              onChange={(e) =>
                form.setFieldValue("contact_phone", e.currentTarget.value)
              }
              error={form.errors.contact_phone}
            />
          </SimpleGrid>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Request
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

LeaveRequestForm.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
