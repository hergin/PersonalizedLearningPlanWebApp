import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import DropDownMenu from "./dropDown/DropDownMenu";
import DropDownItem from "./dropDown/DropDownItem";
import DropDownCheckbox from "./dropDown/DropDownCheckbox";
import { useSettings, useSettingsMutation } from "../hooks/useSettings";
import { useLogoutService } from "../features/login/hooks/useAccountServices";
import { User } from "../types";
import AccountToggles from "./AccountToggles";

interface AccountMenuProps {
    user: User,
    style?: string,
}

export default function AccountMenu({user, style}: AccountMenuProps) {
    const { data, isLoading, error } = useSettings(user.id);
    const { mutate: updateSettings } = useSettingsMutation(user.id);
    const { mutateAsync: logout } = useLogoutService();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/#");
    }

    return (
        <DropDownMenu style={`absolute top-[58px] w-[190px] translate-x-[-45%] translate-y-[20px]${style ? ` ${style}` : ""}`}>
            <DropDownItem 
                leftIcon={<IoIosLogOut className="size-6" />} 
                onClick={handleLogout}
            >
                Logout
            </DropDownItem>
        </DropDownMenu>
    );
}
