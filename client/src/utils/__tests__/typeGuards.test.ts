import { CreatedMessage, Message, GOAL_TYPE, CreateGoalProps, CreateSubGoalProps } from "../../types";
import { isMessageArray, isMessage, isGoalType, isCreatedSubGoal } from "../typeGuards";

describe("Type Guard Unit Tests", () => {
    it.each([
        {value: GOAL_TYPE.ONCE, expectedResult: true},
        {value: GOAL_TYPE.DAILY, expectedResult: true},
        {value: GOAL_TYPE.WEEKLY, expectedResult: true},
        {value: GOAL_TYPE.MONTHLY, expectedResult: true},
    ])("Is Goal Type correctly identifies goal types", ({value, expectedResult}) => {
        expect(isGoalType(value)).toBe(expectedResult);
    });

    const mockCreatedParentGoal: CreateGoalProps = {
        name: "do Homework",
        description: "spend 3 hours a day on homework",
        isComplete: false,
        goalType: GOAL_TYPE.DAILY,
        moduleId: 1,
    };

    const mockCreatedSubGoal: CreateSubGoalProps = {
        name: "Sub Goal",
        description: "This is a sub goal",
        isComplete: false,
        goalType: GOAL_TYPE.DAILY,
        moduleId: 1,
        dueDate: "2030-01-23T14:15:00.000Z",
        tagId: 0,
        parentId: 4324
    };

    it.each([
        {value: mockCreatedParentGoal, expectedResult: false},
        {value: mockCreatedSubGoal, expectedResult: true}
    ])("IsCreatedSubGoal correctly identifies the difference between parent and sub goals", ({value, expectedResult}) => {
        expect(isCreatedSubGoal(value)).toBe(expectedResult);
    });

    const mockSenderId = 0;
    const mockRecipientId = 1;
    const mockCreatedMessages: CreatedMessage[] = [
        {
            content: "How are you??",
            sender_id: mockRecipientId,
            recipient_id: mockSenderId,
        },
        {
            content: "Pretty good :3",
            sender_id: mockSenderId,
            recipient_id: mockRecipientId,
        }
    ]

    const mockMessages: Message[] = [
        {
            ...mockCreatedMessages[0],
            id: 0,
            username: "Xx_TestDummy_xX",
            date: ""
        },
        {
            ...mockCreatedMessages[1],
            id: 1,
            username: "Coach Steven",
            date: ""
        }
    ];

    it.each([
        {value: {}, expectedResult: false},
        {value: {content: "I'm a message, trust :3"}, expectedResult: false},
        {value: mockCreatedMessages[0], expectedResult: false},
        {value: mockCreatedMessages[1], expectedResult: false},
        {value: mockMessages[0], expectedResult: true},
        {value: mockMessages[1], expectedResult: true}
    ])("Is Message correctly identifies messages", ({value, expectedResult}) => {
        expect(isMessage(value)).toBe(expectedResult);
    });

    it.each([
        {value: [], expectedResult: true},
        {value: [{content: "I'm a message, dw about it"}], expectedResult: false},
        {value: mockCreatedMessages, expectedResult: false},
        {value: mockMessages, expectedResult: true}
    ])("Is Message Array correctly identifies message arrays", ({value, expectedResult}) => {
        expect(isMessageArray(value)).toBe(expectedResult);
    });
});
