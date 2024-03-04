import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import ModuleComponent from "./ModuleComponent";
import TabPanel from "./TabPanel";
import { useUnderstudies } from "../../login/hooks/useUnderstudies";
import { useAuth } from "../../../context/AuthContext";
import { emptyUser, Understudy } from "../../../types";
import DefaultProfilePicture from "../../../assets/Default_Profile_Picture.jpg";

function PlaceholderProfilePicture() {
  return (
    <img 
      src={DefaultProfilePicture} 
      alt="Profile Picture Here"
      className="size-7 rounded-full"
    />
  );
}

export default function LearningPlan() {
  const { user, setUser } = useAuth();
  const { data: understudyData, isLoading, error } = useUnderstudies(user.id);
  const [ currentTabIndex, setCurrentTabIndex ] = useState(user.id);

  useEffect(() => {
    console.log(`Default screen: ${sessionStorage.getItem("user")}`);
    const currentUser: string | null = sessionStorage.getItem("user");
    setUser(currentUser ? JSON.parse(currentUser) : emptyUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(isLoading) {
    <p>Loading, please wait...</p>
  }

  if(error) {
    <p>An error has occurred. Please try again.</p>
  }

  return (
    <div>
      <Tabs
        value={currentTabIndex}
        onChange={(event: React.SyntheticEvent, newValue: number) => {setCurrentTabIndex(newValue)}}
        scrollButtons="auto"
        className="p-4 mx-auto "
      >
        {/* Icons will be replaced by actual profile pictures later on, but for now we're using placeholders. */}
        <Tab label="You" value={user.id} icon={<PlaceholderProfilePicture />} iconPosition="start"/>
        {understudyData?.map((understudy: Understudy) => (
          <Tab 
            key={`KEY-${understudy.account_id}`} 
            label={understudy.username} 
            value={understudy.account_id}
            icon={<PlaceholderProfilePicture />}
            iconPosition="start"
            className=""
          />
        ))}
      </Tabs>
      <TabPanel value={currentTabIndex} index={user.id}>
        <ModuleComponent accountId={user.id} />
      </TabPanel>
      {understudyData?.map((understudy: Understudy) => (
        <TabPanel 
          key={`PANEL_KEY-${understudy.account_id}`} 
          value={currentTabIndex}
          index={understudy.account_id}
        >
          <ModuleComponent accountId={understudy.account_id} />
        </TabPanel>
      ))}
    </div> 
  );
}
