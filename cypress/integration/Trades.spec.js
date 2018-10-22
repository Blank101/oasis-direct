import { visitWithWeb3, tid, revertToSnapshot } from "../utils";

context('Trading', () => {
  const ETH_AMOUNT_TO_SELL = '2';
  const DAI_AMOUNT_TO_RECEIVE = '555';

  const trade = {};

  beforeEach(() => visitWithWeb3());
  afterEach(() => revertToSnapshot());

  const getTradeParameters = () => {
    cy.get(tid("trade-parameter-price")).find(tid("token-amount-value"))
      .then(priceElement => trade.price = priceElement.text().replace("~","").trim());

    cy.get(tid("trade-parameter-threshold"))
      .then(threshold => trade.threshold = threshold.text().trim());

    cy.get(tid("trade-parameter-gas")).find(tid("token-amount-value"))
      .then(gasCost => trade.gasCost = gasCost.text().trim());

    cy.get(tid("trade-parameter-impact"))
      .then(impact => trade.impact = impact.text().trim());
  };

  it("should create a proxy and sell ETH for DAI", () => {
    cy.get(tid("wallets-continue")).contains("Continue").click();

    cy.get(tid("set-trade-from-amount"))
      .find('input').type(ETH_AMOUNT_TO_SELL);

    cy.get(tid("set-trade-to-amount"), {timeout: 2000})
      .find('input').should('have.value', `${DAI_AMOUNT_TO_RECEIVE}.00000`);

    getTradeParameters();

    //  NOTE: we need to click this exact spot to avoid downloading PDF file instead (link is in the button as well)
    cy.get(tid("terms-and-conditions")).click({position: "topRight", force: true});
    cy.get(tid("initiate-trade")).click();

    cy.get(tid("trade-with-builtin-proxy-creation"))
      .find('.details')
      .find('.label.vertical-align span')
      .then((value) => {
        expect(value.text().trim()).to.eq('Create Proxy');
      });

    cy.get(tid("trade-token-from"))
      .find(tid("token-amount-value"))
      .then((value) => {
        expect(value.text().trim()).to.eq(`${ETH_AMOUNT_TO_SELL} ETH`);
      });

    cy.get(tid("trade-token-to"))
      .find(tid("token-amount-value"))
      .then((value) => {
        expect(value.text().trim()).to.eq(`${DAI_AMOUNT_TO_RECEIVE} DAI`);
      });

    const waitForTradeToFinish = 20000;

    cy.get(tid("proxy-creation-summary"), {timeout: waitForTradeToFinish})
      .then((value) => {
        expect(value.text().trim()).to.eq('You have successfully created a Proxy')
      });

    cy.get(tid("congratulation-message"), {timeout: waitForTradeToFinish})
      .find(tid("token-amount-value"))
      .first()
      .then(value =>
        expect(value.text().trim()).to.eq(`${ETH_AMOUNT_TO_SELL} ETH`)
      );

    cy.get(tid("congratulation-message"), {timeout: waitForTradeToFinish})
      .find(tid("token-amount-value"))
      .eq(1)
      .then(value =>
        expect(value.text().trim()).to.eq(`${DAI_AMOUNT_TO_RECEIVE} DAI`)
      );

    cy.get(tid("congratulation-message"), {timeout: waitForTradeToFinish})
      .find(tid("token-amount-value"))
      .eq(2)
      .then(value =>
        expect(value.text().trim()).to.eq(trade.price)
      );
  });
});