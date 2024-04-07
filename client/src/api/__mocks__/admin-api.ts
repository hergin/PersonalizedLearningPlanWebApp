const mockFetchAllAccounts = jest.fn();
const mockSetAccountAsRole = jest.fn();

const mock = () => ({
    fetchAllAccounts: mockFetchAllAccounts,
    setAccountAsRole: mockSetAccountAsRole,
});

export default mock;
