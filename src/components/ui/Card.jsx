import { cn } from '@utils/cn';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('p-6 border-b border-gray-200', className)} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('p-6 border-t border-gray-200', className)} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

