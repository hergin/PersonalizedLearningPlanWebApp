import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import ModuleComponent from "./ModuleComponent";
import TabPanel from "../../../components/TabPanel";
import { useUnderstudies } from "../../login/hooks/useUnderstudies";
import { useAuth } from "../../../context/AuthContext";
import { emptyUser, Understudy } from "../../../types";
import ProfilePicture from "../../../components/ProfilePicture";
import useDocumentTitle from "../../../hooks/useTitle";
import Load from "../../../components/LoadScreen";
import Error from "../../../components/ErrorScreen";

const TABPANEL_STYLE = "p-[2%] h-[590px]";

export default function LearningPlan() {
  const { user, setUser } = useAuth();
  const { data: understudyData, isLoading, error } = useUnderstudies(user.id);
  const [currentTabIndex, setCurrentTabIndex] = useState(user.id);

  useDocumentTitle("Personalized Learning Plan | Goal Sets")

  useEffect(() => {
    const currentUser: string | null = sessionStorage.getItem("user");
    setUser(currentUser ? JSON.parse(currentUser) : emptyUser);
    document.title = 'Personalized Learning Plan | Goals';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Load/>;
  }

  if (error) {
    return <Error error={error}/>;
  }

  return (
    <div>
      <Tabs
        value={currentTabIndex}
        onChange={(event: React.SyntheticEvent, newValue: number) => {
          setCurrentTabIndex(newValue);
        }}
        scrollButtons="auto"
        className="px-4 mx-4"
        TabIndicatorProps={{
          style: {
            color: "black",
          },
        }}
      >
        {/* Icons will be replaced by actual profile pictures later on, but for now we're using placeholders. */}
        <Tab
          label="You"
          value={user.id}
          icon={<ProfilePicture style="size-7" />}
        />
        {understudyData?.map((understudy: Understudy) => (
          <Tab
            key={`KEY-${understudy.account_id}`}
            label={understudy.username}
            value={understudy.account_id}
            icon={<ProfilePicture style="size-7" />}
          />
        ))}
      </Tabs>
      <TabPanel selectedValue={currentTabIndex} index={user.id} style={TABPANEL_STYLE}>
        <ModuleComponent accountId={user.id} />
      </TabPanel>
      {understudyData?.map((understudy: Understudy) => (
        <TabPanel
          key={`PANEL_KEY-${understudy.account_id}`}
          selectedValue={currentTabIndex}
          index={understudy.account_id}
          style={TABPANEL_STYLE}
        >
          <ModuleComponent accountId={understudy.account_id} />
        </TabPanel>
      ))}
    </div>
  );
}
