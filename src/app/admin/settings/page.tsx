"use client";

import { Settings } from "../../../feature/shared/settings";

export default function AdminSettings() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Settings isAdmin={true} />
    </div>
  );
}