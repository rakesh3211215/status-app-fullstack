import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function StatusTable({ statuses = [], onDelete, onUpdate }) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState(null);
  const [editedStatus, setEditedStatus] = useState({});

  const safeStatuses = Array.isArray(statuses) ? statuses : [];

  const handleEditClick = (status) => {
    setEditingId(status._id);
    setEditedStatus({
      title: status.title,
      description: status.description,
      category: status.category,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    if (onUpdate) {
      onUpdate(id, editedStatus);
    }
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">{t("title")}</th>
            <th className="py-2 px-4 border-b">{t("description")}</th>
            <th className="py-2 px-4 border-b">{t("category")}</th>
            <th className="py-2 px-4 border-b">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {safeStatuses.length > 0 ? (
            safeStatuses.map((status) => (
              <tr key={status._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {editingId === status._id ? (
                    <input
                      type="text"
                      name="title"
                      value={editedStatus.title}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    status.title
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editingId === status._id ? (
                    <textarea
                      name="description"
                      value={editedStatus.description}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                      rows="2"
                    />
                  ) : (
                    status.description
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editingId === status._id ? (
                    <input
                      type="text"
                      name="category"
                      value={editedStatus.category}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    status.category
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editingId === status._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(status._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        {t("save")}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(status)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {t("edit")}
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(status._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                {t("no_statuses_found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StatusTable;
