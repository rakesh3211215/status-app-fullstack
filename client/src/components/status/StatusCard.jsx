import React from "react";
import { useTranslation } from "react-i18next";

function StatusCard({ status, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (!status) return null;

  return (
    <div className=" p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{status.title}</h3>
          <p className="text-gray-600 mt-2">{status.description}</p>
          <div className="mt-3">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {status.category}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex mt-3 sm:mt-0 sm:ml-4 space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(status)}
                className="text-blue-600 hover:text-blue-800"
                aria-label="Edit status"
              >
                {t("edit", "Edit")}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(status._id)}
                className="text-red-600 hover:text-red-800"
                aria-label="Delete status"
              >
                {t("delete", "Delete")}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {new Date(status?.createdAt).toLocaleString()}
      </div>
    </div>
  );
}

export default StatusCard;
