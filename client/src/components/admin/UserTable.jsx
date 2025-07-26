import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function UserTable({ users = [], onRoleChange }) {
  const { t } = useTranslation();

  const [editingId, setEditingId] = useState(null);
  const [roleEdits, setRoleEdits] = useState({});

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setRoleEdits((prev) => ({ ...prev, [user._id]: user.role }));
  };

  const handleSaveClick = (userId) => {
    if (onRoleChange && roleEdits[userId]) {
      onRoleChange(userId, roleEdits[userId]);
    }
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleSelectChange = (userId, newRole) => {
    setRoleEdits((prev) => ({ ...prev, [userId]: newRole }));
  };

  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">{t("name")}</th>
            <th className="py-2 px-4 border-b">{t("email")}</th>
            <th className="py-2 px-4 border-b">{t("role")}</th>
            <th className="py-2 px-4 border-b">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {safeUsers.length > 0 ? (
            safeUsers.map((user) => {
              const isEditing = editingId === user._id;
              return (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    {isEditing ? (
                      <select
                        value={roleEdits[user._id] || ""}
                        onChange={(e) =>
                          handleSelectChange(user._id, e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role || "-"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSaveClick(user._id)}
                          className="text-green-600 hover:text-green-800"
                          aria-label="Save role"
                        >
                          {t("save")}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelClick}
                          className="text-gray-600 hover:text-gray-800"
                          aria-label="Cancel edit"
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Edit role"
                      >
                        {t("edit")}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                {t("no_users_found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
