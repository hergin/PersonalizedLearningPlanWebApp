import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import DropDownMenu from "./dropDown/DropDownMenu";
import DropDownItem from "./dropDown/DropDownItem";
import DropDownCheckbox from "./dropDown/DropDownCheckbox";
import { useSettings, useSettingsMutation } from "../hooks/useSettings";
import { useLogoutService } from "../features/login/hooks/useAccountServices";
import { User } from "../types";

interface AccountTogglesProps {
    user: User,
    style?: string,
}

export default function AccountToggles({user, style}: AccountTogglesProps) {
    const { data, isLoading, error } = useSettings(user.id);
    const { mutate: updateSettings } = useSettingsMutation(user.id);
    const { mutateAsync: logout } = useLogoutService();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/#");
    }

    return (
        <div>
            {isLoading && <p data-testid="loadingText">Loading...</p>}
            {error && <p data-testid="errorText">An error has occurred!</p>}
            {!isLoading && !error && 
                <div data-testid="dropDownContainer">
                    <DropDownCheckbox 
                        handleCheckToggle={(checked) => 
                            updateSettings({allowCoachInvitations: data[0].allow_coach_invitations, receiveEmails: checked})
                        } 
                        checked={data[0].receive_emails}
                    >
                        Receives Email
                    </DropDownCheckbox>
                    <DropDownCheckbox 
                        handleCheckToggle={(checked) => 
                            updateSettings({receiveEmails: data[0].receive_emails, allowCoachInvitations: checked})
                        } 
                        checked={data[0].allow_coach_invitations}
                    >
                        Allow Invites
                    </DropDownCheckbox>
                </div>
            }
        </div>
    );
}
