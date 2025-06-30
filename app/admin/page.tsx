import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { requireAuth } from '@/lib/auth';

export default async function AdminPage() {
  await requireAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}