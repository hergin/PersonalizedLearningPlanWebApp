import React from "react";
import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Navbar from "../Navbar";
import { User, emptyUser } from "../../types";

var mockUser: User = emptyUser;
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));
jest.mock("../AccountButton");

function TestDefaultScreen() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

describe("Navbar Unit Tests", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("Not signed in case", () => {
    mockUser = emptyUser;
    const { getByTestId } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestDefaultScreen />}>
            <Route path="/LearningPlan" element={<p>Learning Plan</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
    expect(getByTestId("top-level-navbar")).toBeInTheDocument();
    expect(() => getByTestId("bottom-level-navbar")).toThrow(expect.any(Error));
  });

  it("Signed in case", () => {
    mockUser = {
      id: 1,
      role: "basic",
      accessToken: "Access Token",
      refreshToken: "Refresh Token"
    };
    const { getByTestId } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestDefaultScreen />}>
            <Route path="/LearningPlan" element={<p>Learning Plan</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
    expect(getByTestId("top-level-navbar")).toBeInTheDocument();
    expect(getByTestId("bottom-level-navbar")).toBeInTheDocument();
  });

  it("Navbar Links are correct", () => {
    mockUser = {
      id: 1,
      role: "basic",
      accessToken: "Access Token",
      refreshToken: "Refresh Token"
    };
    const { getByTestId } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestDefaultScreen />}>
            <Route path="/LearningPlan" element={<p>Learning Plan</p>} />
            <Route path="/coaching" element={<p>Coaching</p>} />
            <Route path="/profile" element={<p>Profile</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
    expect(window.location.pathname).toEqual("/");
    fireEvent.click(getByTestId("modulesLink"));
    expect(window.location.pathname).toEqual("/LearningPlan");
    fireEvent.click(getByTestId("coachingLink"));
    expect(window.location.pathname).toEqual("/coaching");
    fireEvent.click(getByTestId("profileLink"));
    expect(window.location.pathname).toEqual("/profile");
  });
});
