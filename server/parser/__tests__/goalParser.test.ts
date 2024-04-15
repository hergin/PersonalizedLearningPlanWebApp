import GoalParser from '../goalParser';
import { Pool } from 'pg';
import { generateInsertQuery, generateUpdateQuery } from '../../utils/queryGenerator';
import { Goal, CreateGoalProps, GOAL_TYPE, Query } from '../../types';

jest.mock("pg");
jest.mock("../../utils/queryGenerator");

const mockModuleId = 0;
const mockTagId = 69;

const TEST_DATES = {
    dueDate: "2025-01-01T23:59:59.000Z",
    completionTime: "2024-01-23T14:19:19.000Z",
    distantFutureDate: "2030-01-23T14:15:00.000Z",
};
const mockParentGoalId = 0;
const mockSubGoalId = 1;
const mockCreatedGoals: CreateGoalProps[] = [
    {
        name: "Complete this quiz",
        description: "This is a quiz that I need to complete.",
        is_complete: false,
        goal_type: GOAL_TYPE.ONCE,
        module_id: mockModuleId,
    },
    {
        name: "Sub Goal",
        description: "This is a sub goal",
        is_complete: false,
        goal_type: GOAL_TYPE.ONCE,
        module_id: mockModuleId,
        tag_id: mockTagId,
        parent_goal: mockParentGoalId
    },
];
const mockGoals: Goal[] = [
    {
        goal_id: mockParentGoalId,
        name: "Homework",
        description: "Complete my homework today.",
        is_complete: false,
        goal_type: GOAL_TYPE.ONCE,
        module_id: mockModuleId,
        due_date: TEST_DATES.dueDate,
    },
    {
        goal_id: mockSubGoalId,
        name: "Sub Goal 2",
        description: "This is another sub goal",
        is_complete: false,
        goal_type: GOAL_TYPE.ONCE,
        module_id: mockModuleId,
        tag_id: mockTagId,
        due_date: TEST_DATES.dueDate,
        parent_goal: mockParentGoalId
    }
]

describe('goal parser tests', () => {
    var parser = new GoalParser();
    var mockQuery: jest.Mock<any, any, any>;
    var mockGenerateInsertQuery: jest.Mock<any, any, any>;
    var mockGenerateUpdateQuery: jest.Mock<any, any, any>;

    beforeEach(async () => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
        mockGenerateInsertQuery = generateInsertQuery as jest.Mock<any, any, any>;
        mockGenerateUpdateQuery = generateUpdateQuery as jest.Mock<any, any, any>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('store goal', async () => {
        const mockGoal: CreateGoalProps = mockCreatedGoals[0];
        const mockInsertQuery: Query = {
            text: "INSERT INTO GOAL(name, description, is_complete, goal_type, module_id) VALUES ($1, $2, $3, $4, $5)",
            values: [mockGoal.name, mockGoal.description, mockGoal.is_complete, mockGoal.goal_type, mockGoal.module_id]
        };
        mockGenerateInsertQuery.mockReturnValue(mockInsertQuery);
        mockQuery.mockResolvedValueOnce({});
        await parser.storeGoal(mockGoal);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(mockInsertQuery);
    });

    it('parse parent goals', async () => {
        mockQuery.mockResolvedValueOnce({rows: mockCreatedGoals});
        const result = await parser.parseParentGoals(mockModuleId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM get_goals($1) where parent_goal is null",
            values: [mockModuleId]
        });
        expect(result).toEqual(mockCreatedGoals);
    });

    it('parse goal variable (module_id case)', async () => {
        const mockVariable = "module_id";
        mockQuery.mockResolvedValueOnce({rows: [{module_id: mockModuleId}]});
        const result = await parser.parseGoalVariable(mockParentGoalId, mockVariable);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: `SELECT ${mockVariable} FROM GOAL WHERE goal_id = $1`,
            values: [mockParentGoalId]
        });
        expect(result).toEqual([{module_id: mockModuleId}]);
    });

    it('update goal', async () => {
        const mockUpdatedName = "Mark";
        const mockUpdatedGoal: Goal = {...mockGoals[0], name: mockUpdatedName};
        const mockUpdateQuery: Query = {
            text: "UPDATE GOAL SET name = $1, description = $2, is_complete = $3, goal_type = $4, module_id = $5 WHERE goal_id = $6",
            values: [mockUpdatedGoal.name, mockUpdatedGoal.description,  mockUpdatedGoal.is_complete, mockUpdatedGoal.goal_type, mockUpdatedGoal.module_id, mockUpdatedGoal.goal_id]
        };
        mockGenerateUpdateQuery.mockReturnValueOnce(mockUpdateQuery);
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.updateGoal(mockUpdatedGoal);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(mockUpdateQuery);
    });

    it('update goal feedback', async () => {
        const mockFeedback = "This is feedback.";
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.updateGoalFeedback(mockParentGoalId, mockFeedback);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE GOAL SET feedback = $1 WHERE goal_id = $2",
            values: [mockFeedback, mockParentGoalId]
        });
    });

    it('delete goal', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteGoal(mockParentGoalId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM GOAL WHERE goal_id = $1",
            values: [mockParentGoalId]
        });
    });

    it('parse sub goals', async () => {
        mockQuery.mockResolvedValueOnce({rows: [mockCreatedGoals[2], mockCreatedGoals[3]]});
        const result = await parser.parseSubGoals(mockParentGoalId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM goal_with_tag WHERE parent_goal = $1",
            values: [mockParentGoalId]
        });
        expect(result).toEqual([mockCreatedGoals[2], mockCreatedGoals[3]]);
    });

    it('parse accounts with upcoming due dates', async () => {
        const mockRows = [
            {
                id: mockParentGoalId,
                goal: mockCreatedGoals[1].name,
                username: "Xx_TestDummy_xX",
                email: "testdummy420@outlook.com",
                due_date: TEST_DATES.distantFutureDate
            }
        ];
        mockQuery.mockResolvedValueOnce({rows: mockRows});
        const result = await parser.parseAccountsWithUpcomingDueDates();
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(`
            SELECT g.goal_id as id, g.name as goal, p.username as username, a.email as email, g.due_date as due_date
            FROM GOAL g JOIN MODULE m USING (module_id) JOIN ACCOUNT a ON a.id = m.account_id JOIN PROFILE p ON a.id = p.account_id JOIN ACCOUNT_SETTINGS s ON s.account_id = a.id
            WHERE g.due_date IS NOT NULL AND g.is_complete IS FALSE AND s.receive_emails IS TRUE AND g.due_date <= (CURRENT_TIMESTAMP + INTERVAL '24 hours') AND g.due_date > CURRENT_TIMESTAMP;
        `);
        expect(result).toEqual(mockRows);
    });

    it('run maintenance procedures', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.runMaintenanceProcedures();
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith("CALL update_is_complete()");
    });
});
