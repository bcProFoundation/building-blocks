describe('Authorization Client', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.title().should('eq', 'Authorization Server');
  });
});
