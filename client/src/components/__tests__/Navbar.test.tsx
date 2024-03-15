import React, { PropsWithChildren } from "react";
import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";

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
  it("Navbar Links are correct", () => {
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
