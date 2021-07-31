describe('Identity Client', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.title().should('eq', 'Home');
  });
});
