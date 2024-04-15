import { generateInsertQuery, generateUpdateQuery } from "../queryGenerator";
import { CreateGoalProps, CreateProfileProps, Goal, GOAL_TYPE, Profile } from "../../types";

const mockAccountId = 0;
const mockModuleId = 0;
const mockCreatedGoal : CreateGoalProps = {
    name: "Do homework",
    description: "Do your homework",
    is_complete: false,
    goal_type: GOAL_TYPE.ONCE,
    module_id: mockModuleId,
};
const mockCreatedProfile: CreateProfileProps = {
    username: "Xx_TestDummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    accountId: mockAccountId
};
const mockGoal: Goal = {
    ...mockCreatedGoal,
    goal_id: 0
};
const mockProfile: Profile = {
    ...mockCreatedProfile,
    profileId: 0
}

describe("Query Generator Unit Tests", () => {
    it("Generate Insert Query (Goal case, normal)", () => {
        const newGoal: CreateGoalProps = {...mockCreatedGoal};
        expect(generateInsertQuery(newGoal, "GOAL")).toEqual({
            text: "INSERT INTO GOAL(name, description, is_complete, goal_type, module_id) VALUES ($1, $2, $3, $4, $5)",
            values: [newGoal.name, newGoal.description, newGoal.is_complete, newGoal.goal_type, mockModuleId]
        });
    });

    it("Generate Insert Query (Goal case, undefined value)", () => {
        const newGoal: CreateGoalProps = {...mockCreatedGoal, due_date: undefined};
        expect(generateInsertQuery(newGoal, "GOAL")).toEqual({
            text: "INSERT INTO GOAL(name, description, is_complete, goal_type, module_id) VALUES ($1, $2, $3, $4, $5)",
            values: [newGoal.name, newGoal.description, newGoal.is_complete, newGoal.goal_type, mockModuleId]
        });
    });

    it("Generate Insert Query (Profile case, normal)", () => {
        const newProfile: CreateProfileProps = {...mockCreatedProfile};
        expect(generateInsertQuery(newProfile, "PROFILE")).toEqual({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES ($1, $2, $3, $4)",
            values: [newProfile.username, newProfile.firstName, newProfile.lastName, newProfile.accountId]
        });
    });

    it("Generate Update Query (Goal case, normal)", () => {
        const goal : Goal = {...mockGoal};
        expect(generateUpdateQuery(goal, "GOAL", "goal_id")).toEqual({
            text: "UPDATE GOAL SET name = $1, description = $2, is_complete = $3, goal_type = $4, module_id = $5 WHERE goal_id = $6",
            values: [goal.name, goal.description, goal.is_complete, goal.goal_type, goal.goal_id, goal.module_id]
        });
    });

    it("Generate Update Query (Goal case, undefined value)", () => {
        const goal : Goal = {...mockGoal, due_date: undefined};
        expect(generateUpdateQuery(goal, "GOAL", "goal_id")).toEqual({
            text: "UPDATE GOAL SET name = $1, description = $2, is_complete = $3, goal_type = $4, module_id = $5 WHERE goal_id = $6",
            values: [goal.name, goal.description, goal.is_complete, goal.goal_type, goal.goal_id, goal.module_id]
        });
    });

    it("Generate Update Query (Profile case, normal)", () => {
        const profile : Profile = {...mockProfile};
        expect(generateUpdateQuery(profile, "PROFILE", "profile_id")).toEqual({
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3, account_id = $4 WHERE profile_id = $5",
            values: [profile.username, profile.firstName, profile.lastName, profile.accountId, profile.profileId]
        });
    });

    it("Generate Update Query (Profile case, undefined value)", () => {
        const profile : Profile = {...mockProfile, jobTitle: undefined};
        expect(generateUpdateQuery(mockProfile, "PROFILE", "profile_id")).toEqual({
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3, account_id = $4 WHERE profile_id = $5",
            values: [profile.username, profile.firstName, profile.lastName, profile.accountId, profile.profileId]
        });
    });
});
