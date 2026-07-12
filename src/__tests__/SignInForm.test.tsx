import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SignInForm } from '@/components/Login/SignInForm';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockSignIn = signIn as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockRefresh = jest.fn();

describe('SignInForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush, refresh: mockRefresh });
  });

  it('signs the user in and redirects on valid credentials', async () => {
    mockSignIn.mockResolvedValue({ error: undefined, ok: true });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByPlaceholderText(/Email/i), 'admin-demo@example.com');
    await user.type(screen.getByPlaceholderText(/Password/i), 'demoadmin123');
    await user.click(screen.getByRole('button', { name: /Log In/i }));

    await screen.findByText(/Logging in.../i);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));

    expect(mockRefresh).toHaveBeenCalled();
    expect(screen.queryByText(/Invalid email or password./i)).not.toBeInTheDocument();
  });

  it('shows an error message on invalid credentials', async () => {
    mockSignIn.mockResolvedValue({ error: 'error', ok: false });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByPlaceholderText(/Email/i), 'wrong@example.com');
    await user.type(screen.getByPlaceholderText(/Password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /Log In/i }));

    expect(await screen.findByText(/Invalid email or password./i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
