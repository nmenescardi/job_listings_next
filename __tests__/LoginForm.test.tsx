import SignInForm from '@/components/Auth/SignInForm';
import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');
const mockLogin = jest.fn();

beforeEach(() => {
  (useAuth as jest.Mock).mockReturnValue({
    login: mockLogin,
  });
});

describe('SignInForm component', () => {
  test('SignInForm renders properly', () => {
    const { getByLabelText } = render(<SignInForm />);

    expect(getByLabelText(/your email/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('submitting the form calls the login function', async () => {
    const { getByLabelText, getByRole } = render(<SignInForm />);

    const emailInput = getByLabelText(/your email/i);
    const passwordInput = getByLabelText(/password/i);
    const rememberCheckbox = getByLabelText('Remember me');
    const signInButton = getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(rememberCheckbox);
    fireEvent.click(signInButton);

    // Wait for the form submission to complete
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      remember: true,
      setApiError: expect.any(Function),
    });
  });

  test('form fields are validated as expected', async () => {
    const { getByLabelText, getByRole, findByText } = render(<SignInForm />);

    const emailInput = getByLabelText(/your email/i);
    const passwordInput = getByLabelText(/password/i);
    const signInButton = getByRole('button', { name: /sign in/i });

    // Test with empty fields
    fireEvent.click(signInButton);
    const emailRequiredError = await findByText(/email is a required field/i);
    const passwordRequiredError = await findByText(
      /password is a required field/i
    );
    expect(emailRequiredError).toBeInTheDocument();
    expect(passwordRequiredError).toBeInTheDocument();

    // Test with an invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);
    const invalidEmailError = await findByText(/invalid email format/i);
    expect(invalidEmailError).toBeInTheDocument();

    // Test with a short password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(signInButton);
    const shortPasswordError = await findByText(
      /password must be at least 7 characters/i
    );
    expect(shortPasswordError).toBeInTheDocument();
  });

  test('`apiError` state is updated when there is an error logging in', async () => {
    const mockApiError = 'Login failed';

    const mockLoginWithError = jest
      .fn()
      .mockImplementation(({ setApiError }) => {
        setApiError(mockApiError);
      });

    (useAuth as jest.Mock).mockReturnValue({
      login: mockLoginWithError,
    });

    const { getByLabelText, getByRole, findByText } = render(<SignInForm />);

    const emailInput = getByLabelText(/your email/i);
    const passwordInput = getByLabelText(/password/i);
    const signInButton = getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    // Wait for the login function to be called
    await waitFor(() => expect(mockLoginWithError).toHaveBeenCalledTimes(1));

    // Check if the apiError is displayed on the screen
    const apiErrorElement = await findByText(mockApiError);
    expect(apiErrorElement).toBeInTheDocument();
  });
});
