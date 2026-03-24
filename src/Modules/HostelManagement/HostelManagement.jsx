/**
 * Hostel Management Module Router
 * Entry point that handles all hostel management routes
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import HostelManagementPage from "./index";

export default function HostelManagement() {
  return (
    <Routes>
      <Route path="/*" element={<HostelManagementPage />} />
      <Route path="/management" element={<HostelManagementPage />} />
      <Route path="/" element={<HostelManagementPage />} />
    </Routes>
  );
}
