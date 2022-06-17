describe("Home Page", () => {
  it("should display a list of courses", () => {
    cy.visit("/");
    cy.contains("All Courses");
  });
});
