import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { SignUpForm } from '@/components/Login/SignUpForm';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;
const mockSignIn = signIn as jest.Mock;

mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({}),
} as Response);

describe('SignUpForm', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseRouter.mockReturnValue({ push: mockPush, refresh: mockRefresh });
    });

    it('renders the form with all fields and submit button', () => {
        render(<SignUpForm />);

        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    it('displays password rules message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'weakpass');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'weakpass');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(screen.getByText(/Password must be at least 10 characters and include uppercase, lowercase, number, and special character./i)).toBeInTheDocument();
    });

    it('displays empty fields error message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/All fields are required./i)).toBeInTheDocument();
    });

    it('displays invalid email error message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@invalid');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/Please enter a valid email address./i)).toBeInTheDocument();
    });

    it('displays password mismatch error message', async () => {
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'DifferentPass456!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));

        expect(await screen.findByText(/Passwords do not match./i)).toBeInTheDocument();
    });

    it('submits the form and redirects on successful sign up', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        } as Response);
        mockSignIn.mockResolvedValueOnce({ error: undefined, ok: true });
        const user = userEvent.setup();
        render(<SignUpForm />);

        await user.type(screen.getByPlaceholderText(/Name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'ValidPass123!');
        await user.type(screen.getByPlaceholderText(/Confirm password/i), 'ValidPass123!');
        await user.click(screen.getByRole('button', { name: /Sign Up/i }));
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));

        expect(mockRefresh).toHaveBeenCalled();
        expect(screen.queryByText(/Sign up failed./i)).not.toBeInTheDocument();
    });
});