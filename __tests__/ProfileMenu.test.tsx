import { render, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import ProfileMenu from '@/components/Profile/ProfileMenu';

jest.mock('@/hooks/useAuth');
const mockLogout = jest.fn();

beforeEach(() => {
  (useAuth as jest.Mock).mockReturnValue({
    logout: mockLogout,
    user: { id: 1 },
  });
});

describe('ProfileMenu component', () => {
  test('it renders properly', () => {
    const { getByTestId } = render(<ProfileMenu />);

    expect(getByTestId('profile-menu')).toBeInTheDocument();
  });

  test('component does not render without an user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
      user: null,
    });

    const { queryByTestId } = render(<ProfileMenu />);
    expect(queryByTestId('profile-menu')).not.toBeInTheDocument();
  });

  test('menu opens after clicking the icon', () => {
    const { getByText, getByTestId } = render(<ProfileMenu />);

    const menuIcon = getByTestId('profile-menu__icon');
    fireEvent.click(menuIcon);

    expect(getByText(/sign out/i)).toBeInTheDocument();
  });

  test('the logout function is called after clicking the Sign Out menu item', async () => {
    const { getByText, getByTestId } = render(<ProfileMenu />);

    const menuIcon = getByTestId('profile-menu__icon');
    fireEvent.click(menuIcon);

    const logoutMenuItem = getByTestId('profile-menu__logout');
    fireEvent.click(logoutMenuItem);

    await waitFor(() => expect(mockLogout).toBeCalledTimes(1));
  });

  //TODO: calling logout function
});
