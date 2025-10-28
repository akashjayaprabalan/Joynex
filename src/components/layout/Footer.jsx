import { Container } from '@components/ui';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <Container>
        <div className="py-6">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} Joynex. For University of Melbourne students.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

