
describe('logged in user', () => {
  beforeEach(() => cy.login());

  it('should be able to access cart', () => {
    cy.visit('http://localhost:3000/cart');
    cy.get('[data-cy=cart_page]').should("exist");
  })

  it('should not be able to access administration', () => {
    cy.visit('http://localhost:3000/administration');
    cy.get('[data-cy=admin_page]').should("not.exist");
  })

  it('should be able to access orders page', () => {
    cy.visit('http://localhost:3000/orders');
    cy.get('[data-cy=orders_page]').should("exist");
  })

  it('should be able to access article page', () => {
    cy.visit('http://localhost:3000/pricing/background');
    cy.get('[data-cy=article_page]').should("exist");
  })

  it('should be able to create an order', () => {
    cy.visit('http://localhost:3000/pricing/character/head');
    cy.get('[data-cy=article_page]').should("exist");

    cy.get('[data-cy=input_description]').type('Random description to test');
    cy.get('[data-cy=checkbox_detailed]').click();
    cy.get('[data-cy=checkbox_character]').click();
    cy.get('[data-cy=input_character]').should("exist");

    cy.get('[data-cy=input_image]').type('https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png');
    cy.get('[data-cy=button_submit]').click();
  })

  it('should be able to sign out', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=user_dropdown]').click();
    cy.get('[data-cy=sign_out]').click();
    cy.get('[data-cy=confirm_modal_submit]').click();
  })
})

describe('user without account', () => {
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

  it('should not be able to register without proper data', () => {
    cy.visit('http://localhost:3000');

    cy.get('[data-cy=sign_up]').click();
    cy.get('[data-cy=sign_up_submit]').click();
    cy.get('[data-cy=sign_up_modal]').should("exist");

    cy.get('[data-cy=input_username]').type('testing');
    cy.get('[data-cy=sign_up_submit]').click();
    cy.get('[data-cy=sign_up_modal]').should("exist");

    cy.get('[data-cy=input_email]').type('testing@gmail.com');
    cy.get('[data-cy=sign_up_submit]').click();
    cy.get('[data-cy=sign_up_modal]').should("exist");
    
    cy.get('[data-cy=input_password]').type('123456789*');
    cy.get('[data-cy=sign_up_submit]').click();
    cy.get('[data-cy=sign_up_modal]').should("exist");

    cy.get('[data-cy=input_confirm]').type('123456789*');

  })
})