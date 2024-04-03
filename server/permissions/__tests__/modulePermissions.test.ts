import { User, Module } from "../../types";
import { canEditModule, canDeleteModule } from "../modulePermissions";

const mockOwnerId = 1;
const mockAdmin: User = {id: 0, role: "admin"};
const mockOwner: User = {id: mockOwnerId, role: "basic"};
const mockOutsider: User = {id: 2, role: "basic"};
const mockModule: Module = {
    name: "test module", 
    description: "this module is used for testing",
    completion: 50,
    accountId: mockOwnerId,
};

describe("Module Permission Unit Tests", () => {
    it("Can Edit Module (admin case)", () => {
        expect(canEditModule(mockAdmin, mockModule)).toBe(true);
    });

    it("Can Edit Module (owner case)", () => {
        expect(canEditModule(mockOwner, mockModule)).toBe(true);
    });

    it("Can Edit Module (outsider case)", () => {
        expect(canEditModule(mockOutsider, mockModule)).toBe(false);
    });

    it("Can Delete Module (admin case)", () => {
        expect(canDeleteModule(mockAdmin, mockModule)).toBe(true);
    });

    it("Can Delete Module (owner case)", () => {
        expect(canDeleteModule(mockOwner, mockModule)).toBe(true);
    });

    it("Can Delete Module (outsider case)", () => {
        expect(canDeleteModule(mockOutsider, mockModule)).toBe(false);
    });
});
