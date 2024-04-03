import { User } from "../../types";
import { isAdminOrOwner, isAdminCoachOrOwner, isOwner } from "../permissions";

const mockOwnerId = 1;
const mockAdmin: User = {id: 0, role: "admin"};
const mockCoach: User = {id: 3, role: "coach"};
const mockOwner: User = {id: mockOwnerId, role: "basic"};
const mockOutsider: User = {id: 2, role: "basic"};

describe("Module Permission Unit Tests", () => {
    it("Is Admin Or Owner (admin case)", () => {
        expect(isAdminOrOwner(mockAdmin, mockOwnerId)).toBe(true);
    });

    it("Is Admin or Owner (coach case)", () => {
        expect(isAdminOrOwner(mockCoach, mockOwnerId)).toBe(false);
    });

    it("Is Admin Or Owner (owner case)", () => {
        expect(isAdminOrOwner(mockOwner, mockOwnerId)).toBe(true);
    });

    it("Is Admin or Owner (outsider case)", () => {
        expect(isAdminOrOwner(mockOutsider, mockOwnerId)).toBe(false);
    });

    it("Is Admin, Coach, or Owner (admin case)", () => {
        expect(isAdminCoachOrOwner(mockAdmin, mockOwnerId)).toBe(true);
    });

    it("Is Admin, Coach, or Owner (coach case)", () => {
        expect(isAdminCoachOrOwner(mockAdmin, mockOwnerId)).toBe(true);
    });

    it("Is Admin, Coach, Or Owner (owner case)", () => {
        expect(isAdminCoachOrOwner(mockOwner, mockOwnerId)).toBe(true);
    });

    it("Is Admin, Coach, or Owner (outsider case)", () => {
        expect(isAdminCoachOrOwner(mockOutsider, mockOwnerId)).toBe(false);
    });

    it("Is Owner (admin case)", () => {
        expect(isOwner(mockAdmin, mockOwnerId)).toBe(false);
    });

    it("Is Owner (coach case)", () => {
        expect(isOwner(mockCoach, mockOwnerId)).toBe(false);
    });

    it("Is Owner (owner case)", () => {
        expect(isOwner(mockOwner, mockOwnerId)).toBe(true);
    });

    it("Is Owner (outsider case)", () => {
        expect(isOwner(mockOutsider, mockOwnerId)).toBe(false);
    });
});
