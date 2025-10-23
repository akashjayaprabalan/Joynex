import { Container, Card } from '@components/ui';

const About = () => {
  return (
    <div className="min-h-screen py-20">
      <Container maxWidth="4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Joynex
          </h1>
          <p className="text-xl text-gray-600">
            Building connections that matter
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At Joynex, we're on a mission to revolutionize the way people connect and collaborate. 
            We believe that technology should bring people together, not apart.
          </p>
          <p className="text-gray-600">
            Our platform is designed to make it easy for teams to work together, share ideas, 
            and build amazing things. Whether you're a startup or an enterprise, we have the 
            tools you need to succeed.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To create a world where distance and borders are no longer barriers to 
              collaboration and innovation.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Innovation first</li>
              <li>✓ User-centric design</li>
              <li>✓ Security & privacy</li>
              <li>✓ Continuous improvement</li>
            </ul>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default About;

