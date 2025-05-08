import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock AuthContext
const loginMock = jest.fn();

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

// Ensure the mock server is intercepting requests correctly
const server = setupServer(
  rest.post('http://127.0.0.1:5000/api/auth/register', (_, res, ctx) => {
    const { email } = _.body as any;
    if (email === 'error@example.com') {
      return res(ctx.status(500), ctx.json({ message: 'Server Error' }));
    }
    if (email === 'no-token@example.com') {
      return res(ctx.status(200), ctx.json({}));
    }
    return res(ctx.status(200), ctx.json({ token: 'test-token' }));
  })
);

// Enable MSW
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  loginMock.mockReset();
});
afterAll(() => server.close());

const renderForm = () => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

const fillForm = (email = 'john@example.com') => {
  fireEvent.input(screen.getByPlaceholderText(/First Name/i), {
    target: { value: 'John' },
  });
  fireEvent.input(screen.getByPlaceholderText(/Last Name/i), {
    target: { value: 'Doe' },
  });
  fireEvent.input(screen.getByPlaceholderText(/Email/i), {
    target: { value: email },
  });
  fireEvent.input(screen.getByPlaceholderText(/Password/i), {
    target: { value: '123456' },
  });
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'student' },
  });
};

describe('Register Component', () => {
  test('renders all fields', () => {
    renderForm();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('shows validation errors if fields are empty', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findAllByText(/is required/i)).toHaveLength(5);
  });

  test('shows password length error', async () => {
    renderForm();
    fireEvent.input(screen.getByPlaceholderText(/Password/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  test('submits valid form and calls login', async () => {
    renderForm();
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test-token');
    });
  });

  test('shows error if server fails', async () => {
    renderForm();
    fillForm('error@example.com');
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText(/Server Error/i)).toBeInTheDocument();
  });

  test('shows fallback error if no message from server', async () => {
    server.use(
      rest.post('http://127.0.0.1:5000/api/auth/register', (_, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Something went wrong' }));
      })
    );

    renderForm();
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  test('does not call login if no token', async () => {
    renderForm();
    fillForm('no-token@example.com');
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(loginMock).not.toHaveBeenCalled();
    });
  });

  test('displays error message from API', async () => {
    server.use(
      rest.post('http://127.0.0.1:5000/api/auth/register', (_, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Email already exists' }));
      })
    );
    renderForm();
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
  });

  test('role field validation error', async () => {
    renderForm();
    fillForm();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText(/Role is required/i)).toBeInTheDocument();
  });

  test('does not submit if only some fields are filled', async () => {
    renderForm();
    fireEvent.input(screen.getByPlaceholderText(/First Name/i), {
      target: { value: 'Test' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findAllByText(/is required/i)).not.toHaveLength(0);
    expect(loginMock).not.toHaveBeenCalled();
  });
});
