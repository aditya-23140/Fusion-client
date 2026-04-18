/**
 * ImposeFineModal Component (UC-016)
 * Modal form for imposing a fine on a student
 * Supports: violation category, amount, reason, auto-date
 * Category-specific sub-fields per UC-016 S1
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Button,
  Stack,
  Group,
  Alert,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconInfoCircle } from "@tabler/icons-react";

function ImposeFineModal({ opened, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    student_id: "",
    fine_type: "",
    violation_category: "",
    amount: 0,
    reason: "",
    date: new Date(),
    // Category-specific fields
    item_description: "",
    repair_cost: 0,
    absence_count: 0,
    inspection_date: null,
    violation_details: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.student_id) newErrors.student_id = "Student ID is required";
    if (!formData.fine_type) newErrors.fine_type = "Fine type is required";
    if (!formData.violation_category)
      newErrors.violation_category = "Violation category is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be greater than zero";
    if (!formData.reason || formData.reason.trim().length < 10)
      newErrors.reason = "Reason must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      student_id: formData.student_id,
      fine_type: formData.fine_type,
      violation_category: formData.violation_category,
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date?.toISOString().split("T")[0],
    };

    // Attach category-specific data
    if (formData.violation_category === "property_damage") {
      submitData.item_description = formData.item_description;
      submitData.repair_cost = formData.repair_cost;
    }
    if (formData.violation_category === "attendance") {
      submitData.absence_count = formData.absence_count;
    }
    if (formData.violation_category === "room_standards") {
      submitData.inspection_date = formData.inspection_date
        ?.toISOString()
        .split("T")[0];
      submitData.violation_details = formData.violation_details;
    }

    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleClose = () => {
    setFormData({
      student_id: "",
      fine_type: "",
      violation_category: "",
      amount: 0,
      reason: "",
      date: new Date(),
      item_description: "",
      repair_cost: 0,
      absence_count: 0,
      inspection_date: null,
      violation_details: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Impose Fine"
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Student ID"
            placeholder="Enter student ID or roll number"
            required
            value={formData.student_id}
            onChange={(e) => handleChange("student_id", e.currentTarget.value)}
            error={errors.student_id}
          />

          <Select
            label="Fine Type"
            placeholder="Select fine type"
            required
            data={[
              { value: "Late Entry", label: "Late Entry" },
              { value: "Property Damage", label: "Property Damage" },
              { value: "Mess Dues", label: "Mess Dues" },
              { value: "Discipline", label: "Discipline" },
              { value: "Other", label: "Other" },
            ]}
            value={formData.fine_type}
            onChange={(value) => handleChange("fine_type", value)}
            error={errors.fine_type}
          />

          <Select
            label="Violation Category"
            description="Select the category of violation"
            placeholder="Select violation category"
            required
            data={[
              { value: "hostel_rule", label: "Hostel Rule Violation" },
              { value: "property_damage", label: "Property Damage / Loss" },
              { value: "attendance", label: "Attendance Violation" },
              { value: "room_standards", label: "Room Standards Violation" },
            ]}
            value={formData.violation_category}
            onChange={(value) => handleChange("violation_category", value)}
            error={errors.violation_category}
          />

          {/* Category-specific fields (UC-016 S1) */}
          {formData.violation_category === "property_damage" && (
            <>
              <TextInput
                label="Item Description"
                placeholder="Describe the damaged/lost item"
                value={formData.item_description}
                onChange={(e) =>
                  handleChange("item_description", e.currentTarget.value)
                }
              />
              <NumberInput
                label="Estimated Repair/Replacement Cost (₹)"
                min={0}
                value={formData.repair_cost}
                onChange={(value) => handleChange("repair_cost", value)}
              />
            </>
          )}

          {formData.violation_category === "attendance" && (
            <NumberInput
              label="Number of Absences"
              min={0}
              value={formData.absence_count}
              onChange={(value) => handleChange("absence_count", value)}
            />
          )}

          {formData.violation_category === "room_standards" && (
            <>
              <DateInput
                label="Inspection Date"
                value={formData.inspection_date}
                onChange={(value) => handleChange("inspection_date", value)}
              />
              <Textarea
                label="Specific Violation Details"
                placeholder="Describe the specific violation found during inspection"
                minRows={2}
                value={formData.violation_details}
                onChange={(e) =>
                  handleChange("violation_details", e.currentTarget.value)
                }
              />
            </>
          )}

          <NumberInput
            label="Fine Amount (₹)"
            placeholder="Enter fine amount"
            required
            min={1}
            value={formData.amount}
            onChange={(value) => handleChange("amount", value)}
            error={errors.amount}
          />

          <Textarea
            label="Reason"
            placeholder="Detailed reason for the fine (min 10 characters)"
            required
            minRows={3}
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.currentTarget.value)}
            error={errors.reason}
          />

          <DateInput
            label="Date of Violation"
            description="Auto-populated with today's date, modify if needed"
            value={formData.date}
            onChange={(value) => handleChange("date", value)}
          />

          <Alert
            color="blue"
            variant="light"
            icon={<IconInfoCircle size={16} />}
          >
            <Text size="sm">
              A notification will be automatically sent to the student with fine
              details.
            </Text>
          </Alert>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} color="red">
              Impose Fine
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

ImposeFineModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ImposeFineModal;
