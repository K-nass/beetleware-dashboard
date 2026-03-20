"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link
          href={`/${locale}/dashboard/users/edit/${user.id}`}
          className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
          title="Edit"
          aria-label={`Edit ${user.fullName}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Link>
        <button
          onClick={() => onDelete(user)}
          className="text-red-600 hover:text-red-900"
          title="Delete"
          aria-label={`Delete ${user.fullName}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

