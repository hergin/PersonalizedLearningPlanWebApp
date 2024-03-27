import { generateInsertQuery, generateUpdateQuery } from "../queryGenerator";
import { Goal, GoalType, Profile, Table } from "../../types";

const TEST_GOAL : Goal = {
    name: "Do homework",
    description: "Do your homework",
    is_complete: false,
    goal_type: GoalType.TASK,
};

const TEST_PROFILE: Profile = {
    username: "Xx_TestDummy_xX",
    firstName: "Test",
    lastName: "Dummy",
};

describe("Query Generator Unit Tests", () => {
    it("Generate Insert Query (Goal case, normal)", () => {
        const mockModuleId = 0;
        const mockGoal: Goal = {...TEST_GOAL, module_id: mockModuleId};
        expect(generateInsertQuery(mockGoal, Table.GOAL)).toEqual({
            text: "INSERT INTO GOAL(name, description, is_complete, goal_type, module_id) VALUES ($1, $2, $3, $4, $5)",
            values: [mockGoal.name, mockGoal.description, mockGoal.is_complete, mockGoal.goal_type, mockModuleId]
        });
    });

    it("Generate Insert Query (Goal case, undefined value)", () => {
        const mockModuleId = 0;
        const mockGoal: Goal = {...TEST_GOAL, module_id: mockModuleId, due_date: undefined};
        expect(generateInsertQuery(mockGoal, Table.GOAL)).toEqual({
            text: "INSERT INTO GOAL(name, description, is_complete, goal_type, module_id) VALUES ($1, $2, $3, $4, $5)",
            values: [mockGoal.name, mockGoal.description, mockGoal.is_complete, mockGoal.goal_type, mockModuleId]
        });
    });

    it("Generate Insert Query (Profile case, normal)", () => {
        const mockAccountId = 0;
        const mockProfile: Profile = {...TEST_PROFILE, accountId: mockAccountId};
        expect(generateInsertQuery(mockProfile, Table.PROFILE)).toEqual({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES ($1, $2, $3, $4)",
            values: [mockProfile.username, mockProfile.firstName, mockProfile.lastName, mockProfile.accountId]
        });
    });

    it("Generate Insert Query (Profile case, undefined value)", () => {
        const mockAccountId = 0;
        const mockProfile: Profile = {...TEST_PROFILE, accountId: mockAccountId, bio: undefined};
        expect(generateInsertQuery(mockProfile, Table.PROFILE)).toEqual({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES ($1, $2, $3, $4)",
            values: [mockProfile.username, mockProfile.firstName, mockProfile.lastName, mockProfile.accountId]
        });
    });

    it("Generate Update Query (Goal case, normal)", () => {
        const mockGoalId = 0;
        const mockGoal : Goal = {...TEST_GOAL, goal_id: mockGoalId};
        expect(generateUpdateQuery(mockGoal, Table.GOAL, "goal_id")).toEqual({
            text: "UPDATE GOAL SET name = $1, description = $2, is_complete = $3, goal_type = $4 WHERE goal_id = $5",
            values: [mockGoal.name, mockGoal.description, mockGoal.is_complete, mockGoal.goal_type, mockGoalId]
        });
    });

    it("Generate Update Query (Goal case, undefined value)", () => {
        const mockGoalId = 0;
        const mockGoal : Goal = {...TEST_GOAL, goal_id: mockGoalId, due_date: undefined};
        expect(generateUpdateQuery(mockGoal, Table.GOAL, "goal_id")).toEqual({
            text: "UPDATE GOAL SET name = $1, description = $2, is_complete = $3, goal_type = $4 WHERE goal_id = $5",
            values: [mockGoal.name, mockGoal.description, mockGoal.is_complete, mockGoal.goal_type, mockGoalId]
        });
    });

    it("Generate Update Query (Profile case, normal)", () => {
        const mockProfileId = 0;
        const mockProfile : Profile = {...TEST_PROFILE, profileId: mockProfileId};
        expect(generateUpdateQuery(mockProfile, Table.PROFILE, "profile_id")).toEqual({
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3 WHERE profile_id = $4",
            values: [mockProfile.username, mockProfile.firstName, mockProfile.lastName, mockProfileId]
        });
    });

    it("Generate Update Query (Profile case, undefined value)", () => {
        const mockProfileId = 0;
        const mockProfile : Profile = {...TEST_PROFILE, profileId: mockProfileId, jobTitle: undefined};
        expect(generateUpdateQuery(mockProfile, Table.PROFILE, "profile_id")).toEqual({
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3 WHERE profile_id = $4",
            values: [mockProfile.username, mockProfile.firstName, mockProfile.lastName, mockProfileId]
        });
    });
});
