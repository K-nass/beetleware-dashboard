import { fetchProfileServer } from '@/lib/api/profile-server';
import { User, Phone, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '../../../../components/features/dashboard/pageHeader/PageHeader';

export default async function ProfilePage() {
  const profile = await fetchProfileServer();

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account information" />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Avatar + name header */}
        <div className="bg-blue-600 px-8 py-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
            <span className="inline-block mt-1 px-3 py-0.5 bg-white/20 text-white text-sm rounded-full">
              {profile.role}
            </span>
          </div>
          <div className="ml-auto">
            {profile.isActive ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-100 text-sm rounded-full">
                <CheckCircle className="w-4 h-4" /> Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-100 text-sm rounded-full">
                <XCircle className="w-4 h-4" /> Inactive
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-gray-900 font-medium">{profile.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 md:col-span-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {profile.permissions?.length > 0 ? (
                  profile.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100"
                    >
                      {perm}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No permissions assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
