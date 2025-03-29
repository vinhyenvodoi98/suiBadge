import { Metadata } from 'next';
import DropsList from '@/components/drops/DropsList';
import CreateDropButton from '@/components/drops/CreateDropButton';

export const metadata: Metadata = {
  title: 'SuiBadge Drops | Create and Manage Digital Badges',
  description: 'Create and manage digital badge drops on Sui blockchain',
};

export default function DropsPage() {
  return (
    <main className="min-h-main pt-32 h-full container mx-auto px-4">
      <div className="rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Drops</h1>
            <p className="text-gray-600">Create and manage your digital badges</p>
          </div>
          <CreateDropButton />
        </div>
        <div className="grid gap-6">
          <DropsList />
        </div>
      </div>
    </main>
  );
}
