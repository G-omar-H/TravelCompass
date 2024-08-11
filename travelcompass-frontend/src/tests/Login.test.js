const  React =  require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const Login = require('../pages/Login');

test('renders login form', () => {
  render(<Login />);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});

test('submits login form', () => {
  const handleLogin = jest.fn();
  render(<Login onLogin={handleLogin} />);

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'password123' },
  });
  fireEvent.click(screen.getByText(/login/i));

  expect(handleLogin).toHaveBeenCalled();
});
