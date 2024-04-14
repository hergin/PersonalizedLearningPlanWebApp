import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut, IoIosSettings } from "react-icons/io";
import DropDownMenu from "./dropDown/DropDownMenu";
import DropDownItem from "./dropDown/DropDownItem";
import { useLogoutService } from "../features/login/hooks/useAccountServices";
import { User } from "../types";
import SettingsModal from "./SettingsModal";

interface AccountMenuProps {
    user: User,
    style?: string,
}

export default function AccountMenu({user, ...other}: AccountMenuProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { mutateAsync: logout } = useLogoutService();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/#");
    }

    return (
        <>
            <SettingsModal
                user={user}
                isOpen={isOpen}
                onClose={() => {setIsOpen(false)}}
            />
            <DropDownMenu style="absolute top-[58px] w-[190px] translate-x-[-45%] translate-y-[20px]" {...other}>
                <DropDownItem
                    leftIcon={<IoIosSettings className="size-6" />}
                    onClick={() => {setIsOpen(true)}}
                >
                    Settings
                </DropDownItem>
                <DropDownItem 
                    leftIcon={<IoIosLogOut className="size-6" />} 
                    onClick={handleLogout}
                >
                    Logout
                </DropDownItem>
            </DropDownMenu>
        </>
        
    );
}
