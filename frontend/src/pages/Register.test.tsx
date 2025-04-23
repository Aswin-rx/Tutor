import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

// Mock dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn() })
}));

jest.mock('../utils/api', () => ({
  post: jest.fn()
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Print the DOM after each test if it fails
afterEach(() => {
  // Only print if the test failed
  const assertions = expect.getState().currentTestAssertions as { status: string }[] | undefined;
  if (
    expect.getState().currentTestName &&
    Array.isArray(assertions) &&
    assertions.some((a) => a.status === 'failed')
  ) {
    // eslint-disable-next-line no-console
    console.log('--- DOM OUTPUT ---');
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);
    // eslint-disable-next-line no-console
    console.log('------------------');
  }
});

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders all input fields and button', () => {
    renderWithRouter(<Register />);
    // Print the DOM for debugging
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderWithRouter(<Register />);
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      expect(screen.getByText('Last Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Role is required')).toBeInTheDocument();
    });
  });

  it('shows password min length error', async () => {
    renderWithRouter(<Register />);
    fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('submits form and navigates on success', async () => {
    const mockPost = require('../utils/api').post;
    mockPost.mockResolvedValue({ data: { token: 'test-token' } });
    renderWithRouter(<Register />);
    fireEvent.input(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.input(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.input(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByDisplayValue('Select your role'), { target: { value: 'student' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student'
      }));
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  });

  it('shows API error message on registration failure', async () => {
    const mockPost = require('../utils/api').post;
    mockPost.mockRejectedValue({ response: { data: { message: 'Email already exists' } } });
    renderWithRouter(<Register />);
    fireEvent.input(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.input(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.input(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByDisplayValue('Select your role'), { target: { value: 'tutor' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
