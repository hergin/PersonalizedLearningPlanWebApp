import { useMutation, useQueryClient } from "@tanstack/react-query";
import AccountApi from "../api/account-api";
import { LoginProps, RegisterProps } from "../../../types";

export function useLoginService() {
    const queryClient = useQueryClient();
    const { login } = AccountApi();

    return useMutation({
        mutationFn: async (loginValues: LoginProps) => {await login(loginValues.email, loginValues.password)},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["settings"]});
        }
    });
}

export function useRegistrationService() {
    const queryClient = useQueryClient();
    const { register } = AccountApi();

    return useMutation({
        mutationFn: async (registerValues: RegisterProps) => { await register(registerValues) },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["settings"]});
        }
    });
}

export function useLogoutService() {
    const queryClient = useQueryClient();
    const { logout } = AccountApi();

    return useMutation({
        mutationFn: async () => { await logout()},
        onSuccess: () => {
            queryClient.invalidateQueries();
        }
    });
}

export function useDeletionService() {
    const { deleteAccount } = AccountApi();
    
    return useMutation({
        mutationFn: async (accountId: number) => {
            await deleteAccount(accountId);
        }
    })
}
