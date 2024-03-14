import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "../api/auth-api";
import { LoginProps, RegisterProps } from "../../../types";

export function useLoginService() {
    const queryClient = useQueryClient();
    const { login } = AuthApi();

    return useMutation({
        mutationFn: async (loginValues: LoginProps) => {await login(loginValues.email, loginValues.password)},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["settings"]});
        }
    });
}

export function useRegistrationService() {
    const queryClient = useQueryClient();
    const { register } = AuthApi();

    return useMutation({
        mutationFn: async (registerValues: RegisterProps) => { await register(registerValues) },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["settings"]});
        }
    });
}

export function useLogoutService() {
    const queryClient = useQueryClient();
    const { logout } = AuthApi();

    return useMutation({
        mutationFn: async () => { await logout()},
        onSuccess: () => {
            queryClient.invalidateQueries();
        }
    });
}
