import React from 'react';
import LandingPage from "./LandingPage";

const Exchange = (props) => (
  <LandingPage>
    <section className="Content">
      <main className="Container">
        <div>
          <div className="MainHeading">
            <h1>THE FIRST DECENTRALIZED INSTANT MARKETPLACE</h1>
          </div>
          <div className="SecondaryHeading">
            <h2>No Registration. No Fees.</h2>
          </div>
        </div>

        {props.widget}
      </main>
    </section>

  </LandingPage>
);

export default Exchange;