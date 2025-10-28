import { Container, Card, Button } from '@components/ui';

const Profile = () => {
  const handleSignOut = async () => {
    // TODO: Implement sign out
  };

  return (
    <Container className="py-8">
      <Card className="max-w-xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your Joynex account</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <p className="mt-1 text-lg">John Doe</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">john.doe@student.unimelb.edu.au</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-lg">October 2025</p>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default Profile;
