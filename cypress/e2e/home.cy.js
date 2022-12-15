describe('access to sites and price cards', () => {
  it('runs the app', () => {
    cy.visit('http://localhost:3000');
  })

  it("gets a notification when trying to access a private route", () => {
    cy.visit('http://localhost:3000/cart');
    cy.get("[data-cy=notification]").should("exist");

    cy.visit('http://localhost:3000/administration');
    cy.get("[data-cy=notification]").should("exist");

    cy.visit('http://localhost:3000/pricing/background');
    cy.get("[data-cy=notification]").should("exist");

    cy.visit('http://localhost:3000/pricing/character/head');
    cy.get("[data-cy=notification]").should("exist");

    cy.visit('http://localhost:3000/pricing/character/body');
    cy.get("[data-cy=notification]").should("exist");

    cy.visit('http://localhost:3000/pricing/character/fullbody');
    cy.get("[data-cy=notification]").should("exist");
  });

  it('should show the articles when on pricing', () => {
    cy.visit('http://localhost:3000/pricing');
    cy.get('[data-cy=pricing_card]').eq(0).should("exist");
  });
})

describe('sign in', () => {
  
});