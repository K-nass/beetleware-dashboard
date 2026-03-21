"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { UserListItem } from "@/types/user";
import UserStatusToggle from "./UserStatusToggle";

interface UserRowProps {
  user: UserListItem;
  onDelete: (user: UserListItem) => void;
}

export default function UserRow({ user, onDelete }: UserRowProps) {
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "N/A";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.phoneNumber || 'No phone'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {user.rolesNames || (user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'N/A')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <UserStatusToggle
          userId={user.id}
          isActive={user.isActive}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.joinedDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/${locale}/dashboard/users/view/${user.id}`}
          className="text-blue-600 hover:text-blue-900 mr-4 inline-block"
          title="View Details"
          aria-label={`View details for ${user.fullName}`}
        >
          <Eye className="h-5 w-5 inline" />
        </Link>
        <Link
          href={`/${locale}/dashboard/users/edit/${user.id}`}
          className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
          title="Edit"
          aria-label={`Edit ${user.fullName}`}
        >
          <Pencil className="h-5 w-5 inline" />
        </Link>
        <button
          onClick={() => onDelete(user)}
          className="text-red-600 hover:text-red-900"
          title="Delete"
          aria-label={`Delete ${user.fullName}`}
        >
          <Trash2 className="h-5 w-5 inline" />
        </button>
      </td>
    </tr>
  );
}

