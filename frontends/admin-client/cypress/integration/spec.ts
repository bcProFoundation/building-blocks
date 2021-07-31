describe('Admin Client', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.title().should('eq', 'Infrastructure Console');
  });
});
