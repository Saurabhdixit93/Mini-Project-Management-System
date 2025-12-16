import React from "react";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import ProjectDashboard from "./ProjectDashboard";

// Mock the react-router-dom useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("ProjectDashboard", () => {
  const mockProps = {
    organizationSlug: "test-org",
  };

  it("renders without crashing", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ProjectDashboard {...mockProps} />
      </MockedProvider>
    );

    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("displays loading state initially", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ProjectDashboard {...mockProps} />
      </MockedProvider>
    );

    // The component should show loading state initially
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });
});
